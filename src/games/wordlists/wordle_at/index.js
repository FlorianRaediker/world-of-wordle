/* wordlists copied from https://wordle.at/word-list.js?v=3.9.4 ("solutions" and "allowList" from debugger) */
import solutions from "./solutions.json";
import words from "./words.json";

export const SOLUTIONS = solutions.map(w => w.toLowerCase());

export const WORDS = words.map(w => w.toLowerCase()).sort();
