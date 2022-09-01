import { useState } from "react";
import { Game, GAMES, HardMode, ShareInfo, CharEvaluation } from "../games";
import WordleRow from "../board";
import "./Reconstructor.css";


function wordMatchesEvaluation(solution: string, word: string, evaluation: CharEvaluation[]) {
  if (!(solution.length === word.length && word.length === evaluation.length)) {
    throw new TypeError(`solution (${solution}), word (${word}), and evaluation (${evaluation}) should have the same length`);
  }
  const solutionA = Array.from(solution);
  for (let i = 0; i < evaluation.length; i++) {
    if (evaluation[i] === CharEvaluation.Correct) {
      if (word[i] !== solution[i]) {
        return false;
      }
      solutionA[i] = null;
    }
  }
  for (let i = 0; i < evaluation.length; i++) {
    switch (evaluation[i]) {
      case CharEvaluation.Absent:
        if (solution.includes(word[i]))
          return false;
        break;
      case CharEvaluation.Present:
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

function RowReconstructor(props: { current: string | null, wordlists: Reconstructed[][], evaluation: CharEvaluation[], onSelect: (word: string) => any }) {
  const [collapsed, setCollapsed] = useState(false);

  function renderSelectableWord(word: string, enabled: boolean) {
    return <span className="selectable-word" data-word={word || ""} data-enabled={enabled} data-selected={word === props.current} onClick={() => props.onSelect(word)} key={word}>{word}</span>;
  }

  function renderSelectableWords(words: Reconstructed[]) {
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
  const [game, setGame] = useState<Game>(null);
  const [info, setInfo] = useState<ShareInfo>(null);
  const [enteredSolution, setEnteredSolution] = useState<string>(null);
  const [selectedReconstructs, setSelectedReconstructs] = useState<string[]>(null);

  function parseShareText(shareText: string) {
    for (const game of Object.values(GAMES)) {
      const shareInfo = game.parseShareText(shareText);
      if (shareInfo) {
        setGame(game);
        if (!("error" in shareInfo)) {
          setSelectedReconstructs(Array(shareInfo.evaluations.length).fill(null));
        }
        setInfo(shareInfo);
        return;
      }
    }
    setGame(null);
    setInfo({ error: "The result is invalid" });
  }

  let solution: string;
  let reconstructs: { evaluation: CharEvaluation[], wordlists: Reconstructed[][] }[];
  if (info && !("error" in info)) {
    solution = info.solution || enteredSolution;
    if (solution && solution.length === info.evaluations[0].length) {
      reconstructs = info.evaluations.map(e => ({
        "evaluation": e,
        "wordlists": [
          game.solutions.filter(w => w.length === solution.length && wordMatchesEvaluation(solution, w, e)).map(w => ({ word: w, enabled: true })),
          game.words[solution.length].filter(w => wordMatchesEvaluation(solution, w, e)).map(w => ({ word: w, enabled: true }))
        ]
      }));

      if (info.isHardMode) {
        for (let r = 0; r < info.evaluations.length; r++) {
          const evaluation = info.evaluations[r];
          const selectedReconstruct = selectedReconstructs[r];
          if (selectedReconstruct) {
            for (let c = 0; c < evaluation.length; c++) {
              if (evaluation[c] === CharEvaluation.Present) {
                // character selectedReconstruct[c] must be present in all following words
                for (let i = r + 1; i < info.evaluations.length; i++) {
                  for (const wordlist of reconstructs[i].wordlists) {
                    for (const reconstruct of wordlist) {
                      if (!reconstruct.word.includes(selectedReconstruct[c])) {
                        reconstruct.enabled = false;
                      }
                    }
                  }
                }
              } else if (game.hardMode === HardMode.Strict && evaluation[c] === CharEvaluation.Absent) {
                // evaluation for character selectedReconstruct[c] must not be "absent" in all other words
                for (let i = 0; i < info.evaluations.length; i++) {
                  if (i === r) continue;
                  for (const wordlist of reconstructs[i].wordlists) {
                    for (const reconstruct of wordlist) {
                      for (let j = 0; j < reconstruct.word.length; j++) {
                        if (info.evaluations[i][j] === CharEvaluation.Absent && reconstruct.word[j] === selectedReconstruct[c]) {
                          reconstruct.enabled = false;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
            if (game.hardMode === HardMode.Lax || game.hardMode === HardMode.Strict) {
              // all characters from previous words with evaluation "present" must also have evaluation "present" or "correct" in selectedReconstruct
              // in HardMode.Strict, characters with evaluation "present" must have different indices
              const correctChars = [];
              const presentChars = [];
              for (let i = 0; i < selectedReconstruct.length; i++) {
                if (evaluation[i] === CharEvaluation.Correct) {
                  correctChars.push(selectedReconstruct[i]);
                } else if (evaluation[i] === CharEvaluation.Present) {
                  presentChars.push(selectedReconstruct[i]);
                }
              }
              for (let i = 0; i < r; i++) {
                for (const wordlist of reconstructs[i].wordlists) {
                  for (const reconstruct of wordlist) {
                    const correctCharsCopy = [...correctChars];
                    const presentCharsCopy = [...presentChars];
                    for (let j = 0; j < reconstruct.word.length; j++) {
                      if (info.evaluations[i][j] === CharEvaluation.Present) {
                        const char = reconstruct.word[j];
                        if (game.hardMode === HardMode.Strict && char === selectedReconstruct[j]) {
                          reconstruct.enabled = false;
                          break;
                        }
                        if (correctCharsCopy.includes(char)) {
                          correctCharsCopy.splice(correctCharsCopy.indexOf(char), 1);
                        } else if (presentCharsCopy.includes(char)) {
                          presentCharsCopy.splice(presentCharsCopy.indexOf(char), 1);
                        } else {
                          reconstruct.enabled = false;
                          break;
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
    }
  }

  return <div className="reconstructor">
    <label htmlFor="share-input">Insert shareable Wordle result:</label>
    <textarea
      id="share-input"
      placeholder="Wordle 42 3/6&#10;⬛⬛🟨⬛🟨&#10;⬛🟨🟨🟩⬛&#10;🟩🟩🟩🟩🟩"
      onChange={e => parseShareText(e.target.value)}
    />

    {info && "error" in info ? <span className="error">{info.error}</span> : null}
    {info && "warning" in info ? <span className="warning">{info.warning}</span> : null}

    {info && !("error" in info) ?
      <div>
        {info.wordId ? <span className="share-info">Wordle ID: {info.wordId}</span> : null}
        {!info.solution ?
          <span className="share-info">
            Solution: <input type="text" className="solution" onChange={e => setEnteredSolution(e.target.value.toLowerCase())} />
          </span> : null}

        {info.date ? <span className="share-info">Date: {info.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> : null}
        {game.hardMode !== HardMode.None ? <span className="share-info">Hard Mode: {info.isHardMode ? "enabled" : "disabled"}</span> : null}
        {info.solution ? <span className="share-info">Solution: <span className="solution">{info.solution}</span></span> : null}
        {reconstructs ? reconstructs.map((r, i) =>
          <RowReconstructor current={selectedReconstructs[i]} wordlists={r.wordlists} evaluation={r.evaluation} onSelect={w => {
            const s = [...selectedReconstructs];
            s[i] = w;
            setSelectedReconstructs(s);
          }} key={i} />) : null}
      </div> : null}
  </div>;
}