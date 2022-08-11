import { SOLUTIONS as WORDLE_SOLUTIONS, WORDS as WORDLE_WORDS } from "./wordlists/wordle";
import { SOLUTIONS as TAYLORDLE_SOLUTIONS, WORDS as TAYLORDLE_WORDS } from "./wordlists/taylordle";


export enum WordEvaluation {
  absent = "absent",
  present = "present",
  correct = "correct"
}


abstract class Game {
  abstract id: string
  abstract name: string
  abstract url: string
  abstract solutions: string[]
  abstract solutionsSorted: string[]
  abstract words: Record<number, string[]> /* one entry for each word length */

  abstract getWordById(id: number): string
  abstract getIdOnDate(date: Date): number
  abstract getDateById(id: number): Date

  getWordOnDate(date: Date) {
    return this.getWordById(this.getIdOnDate(date));
  }
}


class Wordle extends Game {
  id = "wordle"
  name = "Wordle"
  url = "https://www.nytimes.com/games/wordle/index.html"
  solutions = WORDLE_SOLUTIONS
  solutionsSorted = [...WORDLE_SOLUTIONS].sort()
  words = {5: WORDLE_WORDS}

  getWordById(id: number) {
    const he = this.solutions;

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

    ke.setDate(ke.getDate() + id + 1);
    return ke;
  }
}


class Taylordle extends Game {
  id = "taylordle"
  name = "Taylordle"
  url = "https://taylordle.com"
  solutions = TAYLORDLE_SOLUTIONS
  solutionsSorted = [...TAYLORDLE_SOLUTIONS].sort()
  words = TAYLORDLE_WORDS

  getWordById(id: number) {
    const ee = this.solutions;
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
    var date = new Date(2022, 0, 28, 0, 0, 0, 0);
    date.setDate(date.getDate() + id);
    return date;
  }
}


export const GAMES: {[key: string]: Game} = {
  "wordle": new Wordle(),
  "taylordle": new Taylordle(),
}
