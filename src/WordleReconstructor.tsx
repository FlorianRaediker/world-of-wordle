import { useState } from "react";
import { getWordleById, WordleEvaluation, wordleIdToDate } from "./wordle/wordle";
import { WORDLES, WORDLES_SORTED, WORDS } from "./wordle/wordlists";
import "./WordleReconstructor.css";
import WordleRow from "./WordleRow";


function emojiToEvaluation(emoji: string) {
  return {
    "⬛": WordleEvaluation.absent,
    "🟨": WordleEvaluation.present,
    "🟩": WordleEvaluation.correct
  }[emoji] || null;
}

function wordMatchesEvaluation(solution: string, word: string, evaluation: Array<WordleEvaluation>) {
  if (!(solution.length === word.length && word.length === evaluation.length)) {
    throw new TypeError("solution, word, and evaluation should have the same length");
  }
  const solutionA = Array.from(solution);
  for (let i = 0; i < evaluation.length; i++) {
    if (evaluation[i] === WordleEvaluation.correct) {
      if (word[i] !== solution[i]) {
        return false;
      }
      solutionA[i] = null;
    }
  }
  for (let i = 0; i < evaluation.length; i++) {
    switch (evaluation[i]) {
      case WordleEvaluation.absent:
        if (solution.includes(word[i]))
          return false;
        break;
      case WordleEvaluation.present:
        const index = solutionA.indexOf(word[i]);
        if (word[i] === solution[i] || index === -1)
          return false;
        solutionA[index] = null;
        break;
    }
  }
  return true;
}

interface Reconstructed {
  word: string,
  enabled: boolean
}

function RowReconstructor(props: { current: string | null, wordlists: Array<Array<Reconstructed>>, evaluation: Array<WordleEvaluation>, onSelect: (word: string) => any }) {
  const [collapsed, setCollapsed] = useState(false);

  function renderSelectableWord(word: string, enabled: boolean) {
    return <span className="selectable-word" data-word={word || ""} data-enabled={enabled} data-selected={word === props.current} onClick={() => props.onSelect(word)}>{word}</span>;
  }

  function renderSelectableWords(words: Array<Reconstructed>) {
    return words.map(w => renderSelectableWord(w.word, w.enabled));
  }

  let singleWord: string = null;
  for (const words of props.wordlists) {
    if (words.length === 1 && singleWord == null) {
      if (words[0].enabled) {
        singleWord = words[0].word;
      }
    } else if (words.length > 1) {
      singleWord = null;
      break;
    }
  }

  return <div className="row-reconstructor">
    <div onClick={() => setCollapsed(!collapsed)}>
      <WordleRow letters={singleWord || props.current || " ".repeat(props.evaluation.length)} states={props.evaluation} />
    </div>
    {!singleWord ?
      <div className="wordlists" data-collapsed={collapsed}>
        <div className="selectable-words">{renderSelectableWord(null, true)}</div>
        {props.wordlists.map((words, i) => <div className="selectable-words" key={i}>{renderSelectableWords(words)}</div>)}
      </div> : null}
  </div>;
}

export default function WordleReconstructor(props: {}) {
  const [wordleId, setWordleId] = useState<number>(null);
  const [isHardMode, setIsHardMode] = useState<boolean>(null);
  const [evaluations, setEvaluations] = useState<Array<Array<WordleEvaluation>>>(null);
  const [warning, setWarning] = useState<string>(null);
  const [selectedReconstructs, setSelectedReconstructs] = useState<Array<string>>(null);

  function parseInput(result: string) {
    const match = result.match(/^\s*Wordle (\d+) ([1-6])\/6(\*?)\s+((?:[⬛🟨🟩]{5}\n){0,5}[⬛🟨🟩]{5})\s*$/iu);
    if (match) {
      const [, mId, mTries, mIsHard, mEvaluations] = match;
      const id = parseInt(mId);
      setWordleId(id);
      const tries = parseInt(mTries);
      setIsHardMode(mIsHard === "*");
      const evaluations = mEvaluations.split("\n").map(row => Array.from(row).map(e => emojiToEvaluation(e)));
      console.assert(evaluations.length === tries);
      setEvaluations(evaluations);
      setSelectedReconstructs(Array(evaluations.length).fill(null));
      setWarning(null);
    } else {
      if (result === "") {
        setWarning(null);
      } else {
        setWarning("Invalid input");
      }
      setWordleId(null);
    }
  }

  let solution: string;
  let reconstructs: Array<{ evaluation: Array<WordleEvaluation>, wordlists: Array<Array<Reconstructed>> }>;
  if (wordleId) {
    solution = getWordleById(wordleId);
    reconstructs = evaluations.map(e => ({
      "evaluation": e,
      "wordlists": [
        WORDLES_SORTED.filter(w => wordMatchesEvaluation(solution, w, e)).map(w => ({ word: w, enabled: true })),
        WORDS.filter(w => wordMatchesEvaluation(solution, w, e)).map(w => ({ word: w, enabled: true }))
      ]
    }));

    if (isHardMode) {
      for (let r = 0; r < evaluations.length; r++) {
        const evaluation = evaluations[r];
        const selectedReconstruct = selectedReconstructs[r];
        if (selectedReconstruct) {
          for (let c = 0; c < evaluation.length; c++) {
            if (evaluation[c] === WordleEvaluation.present) {
              // character selectedReconstruct[c] must be present in all following words
              for (let i = r+1; i < evaluations.length; i++) {
                for (const wordlist of reconstructs[i].wordlists) {
                  for (const reconstruct of wordlist) {
                    if (!reconstruct.word.includes(selectedReconstruct[c])) {
                      reconstruct.enabled = false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return <div className="reconstructor">
    <h2>Wordle Reconstructor</h2>

    <label htmlFor="share-input">Insert shareable Wordle result:</label>
    <textarea id="share-input" onChange={e => parseInput(e.target.value)} />
    <span className="warning">{warning}</span>

    {wordleId ?
      <div>
        Wordle ID: {wordleId}<br />
        Date: {wordleIdToDate(wordleId).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br />
        Hard Mode: {isHardMode ? "enabled" : "disabled"}<br />
        Solution: <span className="solution">{solution}</span>
        {reconstructs.map((r, i) => <RowReconstructor current={selectedReconstructs[i]} wordlists={r.wordlists} evaluation={r.evaluation} onSelect={w => {
          const s = [...selectedReconstructs];
          s[i] = w;
          setSelectedReconstructs(s);
        }} key={i} />)}
      </div> : null
    }
  </div>;
}
