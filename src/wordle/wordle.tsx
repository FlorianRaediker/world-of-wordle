import { WORDLES } from "./wordlists";


export enum WordleEvaluation {
  absent = "absent",
  present = "present",
  correct = "correct"
}

export enum TileState {
  empty = "empty",
  tbd = "tbd",
  absent = "absent",
  present = "present",
  correct = "correct"
}

export enum TileAnimation {
  PopIn = 'Tile-module_PopIn__bu7hb',
  FlipIn = 'Tile-module_FlipIn__scjpz',
  FlipOut = 'Tile-module_FlipOut__e4DRI'
}


export function getWordleById(id: number) {
  const he = WORDLES;

  // copied from https://www.nytimes.com/games-assets/v2/wordle.abd1fd2537e27dd11aae0632be1272690ad688f5.js
  function xe(e) {
    if (null === e) return '';
    e %= he.length;
    return he[e]
  }

  return xe(id);
}


export function getWordleOnDate(date: Date) {
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

  return getWordleById(ve(date));
}

export function wordleIdToDate(id: number) {
  // copied from https://www.nytimes.com/games-assets/v2/wordle.abd1fd2537e27dd11aae0632be1272690ad688f5.js
  var ke = new Date(2021, 5, 19, 0, 0, 0, 0);

  ke.setDate(ke.getDate() + id);
  return ke;
}
