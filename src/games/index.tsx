import { SOLUTIONS as WORDLE_SOLUTIONS, WORDS as WORDLE_WORDS } from "./wordlists/wordle";
import { SOLUTIONS as TAYLORDLE_SOLUTIONS, WORDS as TAYLORDLE_WORDS } from "./wordlists/taylordle";
import { SOLUTIONS as WORDLEDEUTSCH_SOLUTIONS, WORDS as WORDLEDEUTSCH_WORDS } from "./wordlists/wordledeutsch";
import { SOLUTIONS as WORDLE_AT_SOLUTIONS, WORDS as WORDLE_AT_WORDS } from "./wordlists/wordle_at";


export enum CharEvaluation {
  Absent = "absent",
  Present = "present",
  Correct = "correct"
}


export enum HardMode {
  None, // Game has no hard mode
  Lax,  // Game has a hard mode, but only present and correct hints must be used and present hints do not enforce specific positions
  Strict  // Game has a hard mode, and all three hint types must be used
}

interface GameInfo {
  readonly name: string
  readonly url: string
  readonly hasDarkTheme?: boolean
  readonly hasColorblindTheme?: boolean
  readonly icon?: string
}

export type ShareInfo = {
  game: Game
  isHardMode: boolean
  evaluations: CharEvaluation[][]
  // the following only exist if the game has ids (DailyGame)
  solutionId?: number
  solution?: string
  date?: Date

  warning?: string
};


export abstract class Game {
  static byId(id: string) {
    return ID_TO_GAME[id];
  }

  abstract readonly id: string
  abstract readonly info: GameInfo
  abstract readonly solutions: string[] /* sorted alphabetically */
  abstract readonly words: Record<number, string[]> /* one entry for each word length; words sorted alphabetically */
  abstract readonly totalTries: number
  abstract readonly hardMode: HardMode
  protected abstract readonly shareTextRegex: RegExp

  protected emojiToEvaluation(emoji: string) {
    return {
      "⬛": CharEvaluation.Absent,
      "⬜": CharEvaluation.Absent,
      "🟨": CharEvaluation.Present,
      "🟩": CharEvaluation.Correct
    }[emoji] || null;
  }

  protected evaluationToEmoji(evaluation: CharEvaluation) {
    return {
      [CharEvaluation.Absent]: "⬛",
      [CharEvaluation.Present]: "🟨",
      [CharEvaluation.Correct]: "🟩"
    }[evaluation] || null;
  }

  protected _parseShareText(shareText: string): [RegExpExecArray, ShareInfo | { error: string }] {
    const match = this.shareTextRegex.exec(shareText);
    if (match) {
      let warning: string;
      const tries = match.groups.tries !== "X" ? parseInt(match.groups.tries) : -1;
      const totalTries = parseInt(match.groups.totalTries);
      const isHardMode = match.groups.hardMode === "*";
      if (isHardMode && !this.hardMode) {
        warning = `Share indicates Hard Mode, but ${this.info.name} has no Hard Mode`;
      } else if (totalTries !== this.totalTries) {
        warning = `Share indicates ${totalTries} total guesses, but ${this.info.name} gives ${this.totalTries}`;
      }
      const evaluations = match.groups.guesses.split("\n").map(row => Array.from(row).map(e => this.emojiToEvaluation(e)));
      if (!evaluations.every(es => es.every(e => e != null))) {
        return [null, null];
      }
      const wordLength = evaluations[0].length;
      if (tries !== -1 && evaluations.length !== tries) {
        warning = `Count of guesses (${tries}/${totalTries}) doesn't match actual guesses`;
      }
      if (!evaluations.every(e => e.length === wordLength)) {
        return [match, { error: "Guesses should all have the same length" }];
      } else if (!(wordLength in this.words)) {
        return [match, { error: `${this.info.name} doesn't have words with length ${wordLength}` }];
      }
      return [match, { game: this, isHardMode, evaluations, warning }];
    }
    return [null, null];
  }

  parseShareText(shareText: string): ShareInfo | { error: string } {
    return this._parseShareText(shareText)[1];
  }

  protected getShareTextTemplate() {
    return `${this.info.name} $id $tries/${this.totalTries}$hardMode\n\n$guesses`;
  }

  generateShareText(id: number, evaluations: CharEvaluation[][], hardMode: boolean = false) {
    return this.generateReconstructedShareText(id, evaluations, Array(evaluations.length).fill(null), hardMode);
  }

  generateReconstructedShareText(properties: {}, evaluations: CharEvaluation[][], guesses: string[], hardMode: boolean = false) {
    let guessesTexts = [];
    for (let i = 0; i < evaluations.length; i++) {
      if (evaluations[i]) {
        guessesTexts.push(evaluations[i].map(e => this.evaluationToEmoji(e)).join(""));
      }
      if (guesses[i]) {
        guessesTexts[guessesTexts.length - 1] += " " + guesses[i].toUpperCase();
      }
    }
    let shareText = this.getShareTextTemplate();
    for (let [key, value] of Object.entries(properties)) {
      if (value) {
        shareText = shareText.replace("$" + key, value.toString());
      }
    }
    return shareText
      .replace("$tries", evaluations.length.toString())
      .replace("$hardMode", hardMode ? "*" : "")
      .replace("$guesses", guessesTexts.join("\n"));
  }
}

export abstract class DailyGame extends Game {
  protected abstract readonly solutionsById: string[]
  protected readonly startId: number = 0
  protected readonly endId: number = null /* last id, if game was discontinued */
  abstract readonly startDate: Date /* date with startId */

  getEndDate() {
    return this.getDateById(this.endId);
  }

  getSolutionById(id: number): string {
    if (id == null || id < this.startId || (this.endId != null && id > this.endId)) {
      return null;
    }
    return this.solutionsById[id % this.solutionsById.length].toLowerCase();
  }

  getIdOnDate(date: Date): number {
    if (date == null || date < this.startDate) {
      return null;
    }
    const id = Math.floor((new Date(date).getTime() - new Date(this.startDate).getTime()) / 86400000) + this.startId;  // 86400000ms = 1day
    return (this.endId != null && id > this.endId) ? null : id;
  }

  getDateById(id: number): Date {
    if (id == null || id < this.startId || (this.endId != null && id > this.endId)) {
      return null;
    }
    return new Date(this.startDate.getTime() + (id - this.startId) * 86400000);  // 86400000ms = 1day
  }

  getSolutionOnDate(date: Date) {
    return this.getSolutionById(this.getIdOnDate(date));
  }

  parseShareText(shareText: string): ShareInfo | { error: string } {
    const [match, info] = this._parseShareText(shareText);
    if (info && !("error" in info)) {
      info.solutionId = parseInt(match.groups.id);
      info.solution = this.getSolutionById(info.solutionId);
      info.date = this.getDateById(info.solutionId);
    }
    return info;
  }

  getPastSolutionsByMonth(lastDate: Date) {
    const months: { firstDate: Date, firstId: number, words: string[] }[] = [];
    const endId = Math.min(this.endId || Infinity, this.getIdOnDate(lastDate) || Infinity);
    for (let id = this.startId; id <= endId; id++) {
      const date = this.getDateById(id);
      if (months.length === 0 || months[months.length - 1].firstDate.getMonth() !== date.getMonth()) {
        months.push({ firstDate: new Date(date), firstId: id, words: [] });
      }
      months[months.length - 1].words.push(this.getSolutionById(id));
    }
    return months;
  }
}


class Wordle extends DailyGame {
  id = "wordle"
  info = {
    name: "Wordle",
    url: "https://www.nytimes.com/games/wordle/index.html",
    hasDarkTheme: true,
    hasColorblindTheme: true,
    icon: "https://www.nytimes.com/games-assets/v2/metadata/wordle-favicon.ico?v=v2209011540"
  }
  solutions = [...WORDLE_SOLUTIONS].sort()
  words = { 5: WORDLE_WORDS }
  totalTries = 6
  hardMode = HardMode.Lax
  shareTextRegex = /Wordle\s+(?<id>\d+)\s+(?<tries>\d+|X)\/(?<totalTries>\d+)(?<hardMode>\*?)\s+(?<guesses>(?:[⬛🟨🟩]{2,}\n)*[⬛🟨🟩]{2,})/iu

  solutionsById = WORDLE_SOLUTIONS
  startDate = new Date("2021-06-19")
}

class WordleDeutsch extends Game {
  id = "wordledeutsch"
  info = {
    name: "Wordle Deutsch",
    url: "https://wordledeutsch.org",
    hasDarkTheme: true,
    hasColorblindTheme: true,
    icon: "https://wordledeutsch.org/images/wordle_logo_32x32.png"
  }
  solutions = [...WORDLEDEUTSCH_SOLUTIONS].sort()
  words = { 5: WORDLEDEUTSCH_WORDS }
  totalTries = 6
  hardMode = HardMode.Lax
  shareTextRegex = /Wordle Deutsch\.?\s+(?<tries>\d+|X)\s+von\s+(?<totalTries>\d+)\s+Versuchen(?<hardMode>\*?)\s+(?<guesses>(?:[⬛⬜🟨🟩]{2,}\n)*[⬛⬜🟨🟩]{2,})/iu
}

class WordleAt extends DailyGame {
  id = "wordle_at"
  info = {
    name: "wordle.at",
    url: "https://wordle.at",
    hasDarkTheme: true,
    hasColorblindTheme: true
  }
  solutions = [...WORDLE_AT_SOLUTIONS].sort()
  words = { 5: WORDLE_AT_WORDS }
  totalTries = 6
  hardMode = HardMode.Strict
  shareTextRegex = /(Wördl|Wordle)\s+(?<id>\d+)\s+(?<tries>\d+|X)\/(?<totalTries>\d+)(?<hardMode>\*?)\s+(?:🔥\d+\s+)?\s+(?<guesses>(?:[⬛⬜🟨🟩]{2,}\n)*[⬛⬜🟨🟩]{2,})/ui

  solutionsById = WORDLE_AT_SOLUTIONS
  startId = 228
  startDate = new Date("2022-02-02")
}


class Taylordle extends DailyGame {
  id = "taylordle"
  info = {
    name: "Taylordle",
    url: "https://taylordle.com",
    hasDarkTheme: true,
    hasColorblindTheme: true,
    icon: "https://www.taylordle.com/favicon.ico"
  }
  solutions = [...TAYLORDLE_SOLUTIONS].sort()
  words = TAYLORDLE_WORDS
  totalTries = 6
  hardMode = HardMode.None
  shareTextRegex = /Taylordle\s+(?<id>\d+)\s+(?<tries>\d+)\/(?<totalTries>\d+)(?<hardMode>\*?)\s+(?<guesses>(?:[⬜🟨🟩]{2,}\n)*[⬜🟨🟩]{2,})/iu

  solutionsById = TAYLORDLE_SOLUTIONS
  endId = 150
  startDate = new Date("2022-01-28")
}

export const WORDLE = new Wordle();

export const GAMES: Game[] = [
  WORDLE,
  new WordleDeutsch(),
  new WordleAt(),
  new Taylordle(),
];

const ID_TO_GAME: { [key: string]: Game } = Object.fromEntries(GAMES.map(g => [g.id, g]));
