import { SOLUTIONS as WORDLE_SOLUTIONS, WORDS as WORDLE_WORDS } from "./wordlists/wordle";
import { SOLUTIONS as TAYLORDLE_SOLUTIONS, WORDS as TAYLORDLE_WORDS } from "./wordlists/taylordle";
import { SOLUTIONS as WORDLEDEUTSCH_SOLUTIONS, WORDS as WORDLEDEUTSCH_WORDS } from "./wordlists/wordledeutsch";
import { SOLUTIONS as WORDLE_AT_SOLUTIONS, WORDS as WORDLE_AT_WORDS} from "./wordlists/wordle_at";


export enum WordEvaluation {
  Absent = "absent",
  Present = "present",
  Correct = "correct"
}


export enum HardMode {
  None, // Game has no hard mode
  Lax,  // Game has a hard mode, but only revealed present and correct hints must be used
  Strict  // Game has a hard mode, and all three hint types must be used
}


export type ShareInfo = (
  {
    tries: number
    isHardMode: boolean
    evaluations: WordEvaluation[][]
    // the following only exist if the game has ids (DailyGame)
    wordId?: number
    solution?: string
    date?: Date

    warning?: string
  } |
  {
    error: string
  }
);


export abstract class Game {
  static byId(id: string) {
    return ID_TO_GAME[id];
  }

  abstract readonly id: string
  abstract readonly name: string
  abstract readonly url: string
  abstract readonly solutions: string[] /* sorted alphabetically */
  abstract readonly words: Record<number, string[]> /* one entry for each word length; words sorted alphabetically */
  abstract readonly totalTries: number
  abstract readonly hardMode: HardMode
  protected abstract readonly shareTextRegex: RegExp

  protected emojiToEvaluation(emoji: string) {
    return {
      "⬛": WordEvaluation.Absent,
      "⬜": WordEvaluation.Absent,
      "🟨": WordEvaluation.Present,
      "🟩": WordEvaluation.Correct
    }[emoji] || null;
  }

  protected _parseShareText(shareText: string): [RegExpExecArray, ShareInfo] {
    const match = this.shareTextRegex.exec(shareText);
    if (match) {
      let warning: string;
      const tries = match.groups.tries !== "X" ? parseInt(match.groups.tries) : -1;
      const totalTries = parseInt(match.groups.totalTries);
      const isHardMode = match.groups.hardMode === "*";
      if (isHardMode && !this.hardMode) {
        warning = `Share indicates Hard Mode, but ${this.name} has no Hard Mode`;
      } else if (totalTries !== this.totalTries) {
        warning = `Share indicates ${totalTries} total guesses, but ${this.name} gives ${this.totalTries}`;
      }
      const evaluations = match.groups.guesses.split("\n").map(row => Array.from(row).map(e => this.emojiToEvaluation(e)));
      const wordLength = evaluations[0].length;
      if (tries !== -1 && evaluations.length !== tries) {
        warning = `Count of guesses (${tries}/${totalTries}) doesn't match actual guesses`;
      } else if (!evaluations.every(e => e.length === wordLength)) {
        return [match, { error: "Guesses should all have the same length" }];
      } else if (!(wordLength in this.words)) {
        return [match, { error: `${this.name} doesn't have words with length ${wordLength}` }];
      }
      return [match, { tries, isHardMode, evaluations, warning }];
    }
    return [null, null];
  }

  parseShareText(shareText: string): ShareInfo {
    return this._parseShareText(shareText)[1];
  }
}

export abstract class DailyGame extends Game {
  abstract getSolutionById(id: number): string
  abstract getIdOnDate(date: Date): number
  abstract getDateById(id: number): Date

  getSolutionOnDate(date: Date) {
    return this.getSolutionById(this.getIdOnDate(date));
  }

  parseShareText(shareText: string): ShareInfo {
    const [match, info] = this._parseShareText(shareText);
    if (info && !("error" in info)) {
      info.wordId = parseInt(match.groups.id);
      info.solution = this.getSolutionById(info.wordId);
      info.date = this.getDateById(info.wordId);
    }
    return info;
  }
}


class Wordle extends DailyGame {
  id = "wordle"
  name = "Wordle"
  url = "https://www.nytimes.com/games/wordle/index.html"
  solutions = [...WORDLE_SOLUTIONS].sort()
  words = { 5: WORDLE_WORDS }
  totalTries = 6
  hardMode = HardMode.Lax
  shareTextRegex = /Wordle\s+(?<id>\d+)\s+(?<tries>\d+|X)\/(?<totalTries>\d+)(?<hardMode>\*?)\s+(?<guesses>(?:[⬛🟨🟩]{2,}\n)*[⬛🟨🟩]{2,})/iu

  getSolutionById(id: number) {
    const he = WORDLE_SOLUTIONS;

    // copied from https://www.nytimes.com/games-assets/v2/wordle.abd1fd2537e27dd11aae0632be1272690ad688f5.js
    function xe(e) {
      if (null === e) return '';
      e %= he.length;
      return he[e]
    }

    return xe(id);
  }

  getIdOnDate(date: Date) {
    // copied from https://www.nytimes.com/games-assets/v2/wordle.abd1fd2537e27dd11aae0632be1272690ad688f5.js
    var ke = new Date(2021, 5, 19, 0, 0, 0, 0);
    function _e(e, t) {
      e = new Date(e);
      e = new Date(t).setHours(0, 0, 0, 0) - e.setHours(0, 0, 0, 0);
      return Math.round(e / 86400000)
    }
    function ve(e) {
      return _e(ke, e)
    }

    return ve(date);
  }

  getDateById(id: number) {
    var ke = new Date(2021, 5, 19, 0, 0, 0, 0);
    ke.setUTCHours(0, 0, 0, 0);
    ke.setDate(ke.getDate() + id + 1);
    return ke;
  }
}

class WordleDeutsch extends Game {
  id = "wordledeutsch"
  name = "Wordle Deutsch"
  url = "https://wordledeutsch.org"
  solutions = [...WORDLEDEUTSCH_SOLUTIONS].sort()
  words = { 5: WORDLEDEUTSCH_WORDS }
  totalTries = 6
  hardMode = HardMode.Lax
  shareTextRegex = /Wordle Deutsch\.?\s+(?<tries>\d+|X)\s+von\s+(?<totalTries>\d+)\s+Versuchen(?<hardMode>\*?)\s+(?<guesses>(?:[⬛⬜🟨🟩]{2,}\n)*[⬛⬜🟨🟩]{2,})/iu

  getWordById(id: number): string {
    throw new Error("Method not implemented.");
  }

  getIdOnDate(date: Date): number {
    throw new Error("Method not implemented.");
  }

  getDateById(id: number): Date {
    throw new Error("Method not implemented.");
  }
}

class WordleAt extends DailyGame {
  id = "wordle_at"
  name = "wordle.at"
  url = "https://wordle.at"
  solutions = [...WORDLE_AT_SOLUTIONS].sort()
  words = {5: WORDLE_AT_WORDS}
  totalTries = 6
  hardMode = HardMode.Strict
  protected shareTextRegex = /Wördl\s+(?<id>\d+)\s+(?<tries>\d+|X)\/(?<totalTries>\d+)(?<hardMode>\*?)\s+(?:🔥\d+\s+)?\s+(?<guesses>(?:[⬛⬜🟨🟩]{2,}\n)*[⬛⬜🟨🟩]{2,})/ui

  getSolutionById(id: number): string {
    const app = {getDayId: () => id};
    const fp = num => ({
      454: "hardModeInterruption",
      421: "getDayId",
      327: "length",
      511: "split"
    }[num]);
    const solutions = WORDLE_AT_SOLUTIONS;

    /* copied from https://wordle.at/main.js?v=3.9.4 */
    app['getTodaysGameData'] = function () {
      const faL = {
        a: 454
      },
      O = fp;
      this[O(faL.a)] = ![];
      let a = 0,
      b = this[O(421)](),
      // @ts-ignore
      solutionString = solutions[(b + a) % solutions[O(327)]],
      // @ts-ignore
      solution = solutionString[O(511)]('');
      return {
        'dayId': b,
        'solution': solution
      };
    }

    return app["getTodaysGameData"]()["solution"];
  }

  getIdOnDate(date: Date): number {
    date = new Date(date);
    const app = {};
    const fp = num => ({
      421: "getDayId",
      416: "2022-02-02",
      260: "setHours",
      550: "round"
    }[num]);

    /* copied from https://wordle.at/main.js?v=3.9.4 */
    app[fp(421)] = function () {
      const faw = {
        a: 550
      },
      z = fp;
      let a = 228,
      b = new Date(z(416)),
      c = date;//new Date();
      c[z(260)](0);
      // @ts-ignore
      let d = Math[z(faw.a)]((c - b) / (24 * 60 * 60 * 1000));
      return d + a;
    }

    return app["getDayId"]();
  }

  getDateById(id: number): Date {
    const date = new Date(2022, 1, 2, 0, 0, 0, 0);
    date.setUTCHours(0, 0, 0, 0);
    date.setDate(date.getDate() + id - 228 + 1);
    return date;
  }
}


class Taylordle extends DailyGame {
  id = "taylordle"
  name = "Taylordle"
  url = "https://taylordle.com"
  solutions = [...TAYLORDLE_SOLUTIONS].sort()
  words = TAYLORDLE_WORDS
  totalTries = 6
  hardMode = HardMode.None
  shareTextRegex = /Taylordle\s+(?<id>\d+)\s+(?<tries>\d+)\/(?<totalTries>\d+)(?<hardMode>\*?)\s+(?<guesses>(?:[⬜🟨🟩]{2,}\n)*[⬜🟨🟩]{2,})/iu

  getSolutionById(id: number) {
    const ee = TAYLORDLE_SOLUTIONS;
    const i = id;

    // copied from https://web.archive.org/web/20220606165324js_/https://www.taylordle.com/static/js/main.c89356ea.js
    return ee[i % ee.length];
  }

  getIdOnDate(date: Date) {
    // copied from https://web.archive.org/web/20220606165324js_/https://www.taylordle.com/static/js/main.c89356ea.js
    var e = function (e, a) {
      var i = 60 * (e.getTimezoneOffset() - a.getTimezoneOffset()) * 1000,
        s = 86400000,
        r = Math.floor((a.getTime() - e.getTime() + i) / s);
      return [r,
        (r + 1) * s + e.getTime() - i]
    }(new Date('January 28, 2022 00:00:00'), date)

    return e[0];
  }

  getDateById(id: number) {
    const date = new Date(2022, 0, 28, 0, 0, 0, 0);
    date.setUTCHours(0, 0, 0, 0);
    date.setDate(date.getDate() + id);
    return date;
  }
}

export const WORDLE = new Wordle();

export const GAMES: Game[] = [
  WORDLE,
  new WordleDeutsch(),
  new WordleAt(),
  new Taylordle(),
];

const ID_TO_GAME: { [key: string]: Game } = Object.fromEntries(GAMES.map(g => [g.id, g]));
