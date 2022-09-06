import { ReactFragment, useState } from "react";
import { WordleBoard } from "../board";
import { Game, GAMES, HardMode, ShareInfo, CharEvaluation } from "../games";
import "./Reconstructor.css";


function renderDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function ReconstructorInput(props: { onInputFinished: (shareInfo: ShareInfo) => void }) {
  const [parsed, setParsed] = useState<{ game: Game, info: ShareInfo, error?: string }>({ game: null, info: null, error: null });
  const [enteredSolution, setEnteredSolution] = useState<string>(null);

  function parseShareText(shareText: string) {
    for (const game of Object.values(GAMES)) {
      const info = game.parseShareText(shareText);
      if (info) {
        if ("error" in info) {
          setParsed({ game: null, info: null, error: info.error });
        } else {
          setParsed({ game, info });
        }
        return;
      }
    }
    if (shareText.trim() !== "") {
      setParsed({ game: null, info: null, error: "The result is invalid" });
    } else {
      setParsed({ game: null, info: null });
    }
  }

  let isValid = parsed.info && (parsed.info.solution || enteredSolution.length === parsed.info.evaluations[0].length);

  return <div className="reconstructor-input">
    <label htmlFor="share-input">Insert shareable Wordle result:</label>
    <textarea
      id="share-input"
      placeholder={"Wordle 42 3/6\n\n⬛⬛🟨⬛🟨\n⬛🟨🟨🟩⬛\n🟩🟩🟩🟩🟩"}
      onChange={e => parseShareText(e.target.value)}
    />

    {parsed.error ? <span className="error">{parsed.error}</span> : null}
    {parsed.info && parsed.info.warning ? <span className="warning">{parsed.info.warning}</span> : null}

    {parsed.info ?
      <div>
        {parsed.info.solutionId ? <span className="share-info">{parsed.game.info.name} #{parsed.info.solutionId}</span> : null}
        {!parsed.info.solution ?
          <span className="share-info">
            Solution: <input type="text" className="solution" onChange={e => setEnteredSolution(e.target.value.toLowerCase())} />
          </span> : null}

        {parsed.info.date ? <span className="share-info">played on {renderDate(parsed.info.date)}</span> : null}
        {parsed.game.hardMode !== HardMode.None && parsed.info.isHardMode ? <span className="share-info">with Hard Mode enabled</span> : null}
        {parsed.info.solution ? <span className="share-info">Solution: <span className="solution">{parsed.info.solution}</span></span> : null}
      </div> : null}

    {isValid ?
      <button className="submit primary" onClick={() => 
        props.onInputFinished({
          game: parsed.game,
          evaluations: parsed.info.evaluations,
          solution: parsed.info.solution || enteredSolution,
          isHardMode: parsed.game.hardMode !== HardMode.None && parsed.info.isHardMode,
          solutionId: parsed.info.solutionId,
          date: parsed.info.date
        })
      }>Reconstruct</button> : null}
  </div>;
}

interface Reconstructed {
  word: string,
  enabled: boolean
}


function getReconstructedWords(game: Game, evaluations: CharEvaluation[][], solution: string, isHardMode: boolean, selectedReconstructs: string[]): Reconstructed[][][] {
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

  let reconstructs: Reconstructed[][][];
  if (solution && solution.length === evaluations[0].length) {
    reconstructs = evaluations.map(evaluation => [
      game.solutions.filter(w => w.length === solution.length && wordMatchesEvaluation(solution, w, evaluation)).map(w => ({ word: w, enabled: true })),
      game.words[solution.length].filter(w => wordMatchesEvaluation(solution, w, evaluation)).map(w => ({ word: w, enabled: true }))
    ]);

    if (isHardMode) {
      for (let r = 0; r < evaluations.length; r++) {
        const evaluation = evaluations[r];
        const selectedReconstruct = selectedReconstructs[r];
        if (selectedReconstruct) {
          for (let c = 0; c < evaluation.length; c++) {
            if (evaluation[c] === CharEvaluation.Present) {
              // character selectedReconstruct[c] must be present in all following words
              for (let i = r + 1; i < evaluations.length; i++) {
                for (const wordlist of reconstructs[i]) {
                  for (const reconstruct of wordlist) {
                    if (!reconstruct.word.includes(selectedReconstruct[c])) {
                      reconstruct.enabled = false;
                    }
                  }
                }
              }
            } else if (game.hardMode === HardMode.Strict && evaluation[c] === CharEvaluation.Absent) {
              // evaluation for character selectedReconstruct[c] must not be "absent" in all other words
              for (let i = 0; i < evaluations.length; i++) {
                if (i === r) continue;
                for (const wordlist of reconstructs[i]) {
                  for (const reconstruct of wordlist) {
                    for (let j = 0; j < reconstruct.word.length; j++) {
                      if (evaluations[i][j] === CharEvaluation.Absent && reconstruct.word[j] === selectedReconstruct[c]) {
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
              for (const wordlist of reconstructs[i]) {
                for (const reconstruct of wordlist) {
                  const correctCharsCopy = [...correctChars];
                  const presentCharsCopy = [...presentChars];
                  for (let j = 0; j < reconstruct.word.length; j++) {
                    if (evaluations[i][j] === CharEvaluation.Present) {
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
  return reconstructs;
}


export default function Reconstructor() {
  const [currentStep, setCurrentStep] = useState<number>(null); /* null: no share text given yet, 0...<=5: select word for each guess */
  const [shareInfo, setShareInfo] = useState<ShareInfo>(null);
  const [selectedReconstructs, setSelectedReconstructs] = useState<string[]>(null);

  function renderReconstruct(word: string, enabled: boolean) {
    return (
      <span
        className="reconstruct"
        data-word={word || ""}
        data-enabled={enabled}
        data-selected={word === selectedReconstructs[currentStep]}
        onClick={() => {
          const s = [...selectedReconstructs];
          s[currentStep] = word;
          setSelectedReconstructs(s);
        }}
        key={word}>
        {word}
      </span>
    );
  }

  let result: JSX.Element | ReactFragment;
  if (shareInfo == null) {
    result = <ReconstructorInput
      onInputFinished={shareInfo => {
        setCurrentStep(0);
        setSelectedReconstructs(Array(shareInfo.evaluations.length).fill(null));
        setShareInfo(shareInfo);
      }} />;
  } else {
    const reconstructs = getReconstructedWords(shareInfo.game, shareInfo.evaluations, shareInfo.solution, shareInfo.isHardMode, selectedReconstructs);

    // for every row, preselect a word if no other word is possible
    /*let singleReconstructs: string[] = [];
    for (const wordlists of reconstructs) {
      let singleReconstruct: string = null;
      for (const words of wordlists) {

      }
      return singleReconstruct;
    }*/

    result = <>
      <button className="back primary" onClick={() => setShareInfo(null)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
        </svg>{" "}
        Reconstruct another
      </button>

      <p>Select a row and choose a fitting guess below.</p>

      {shareInfo.isHardMode ? <p>Hard Mode was enabled, so once you select a guess, guesses from other rows that are no longer possible will be grayed out.</p> : null}

      <p>{shareInfo.game.info.name} {shareInfo.solutionId ? `#${shareInfo.solutionId}` : null} {shareInfo.date ? `on ${renderDate(shareInfo.date)}` : null}</p>

      <div className="guesses">
        <WordleBoard
          guesses={shareInfo.evaluations.map((evaluation, i) => ({ letters: selectedReconstructs[i] || " ".repeat(evaluation.length), evaluation }))}
          selectedGuess={currentStep}
          onGuessSelected={i => setCurrentStep(i)} />
      </div>

      <div className="reconstructs">
        <div className="reconstruct-list">{renderReconstruct(null, true)}</div>
        {reconstructs[currentStep].map((words, i) =>
          <div className="reconstruct-list" key={i}>{words.map(w => renderReconstruct(w.word, w.enabled))}</div>
        )}
      </div>
    </>;
  }

  return <div className="reconstructor">
    <h2>Wordle Reconstructor</h2>
    {result}
  </div>;
}
