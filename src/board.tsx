import { CharEvaluation } from "./games";
import "./board.css";
import { MouseEventHandler } from "react";


export enum TileState {
  empty = "empty",
  tbd = "tbd",
  absent = "absent",
  present = "present",
  correct = "correct"
}


function WordleTile(props: {
  letter: string
  evaluation: TileState | CharEvaluation
}) {
  return <div
    className="wordle-tile"
    data-state={props.evaluation}>
    <span className="letter">{props.letter}</span>
  </div>;
}

export function WordleRow(props: {
  letters: string
  evaluation?: Array<TileState | CharEvaluation>
  isSelected?: boolean
  onClick?: MouseEventHandler<HTMLDivElement> | undefined
}) {
  if (props.evaluation && props.evaluation.length !== props.letters.length) {
    throw new Error("props letters and states should have the same length");
  }
  const tiles = [];
  for (let i = 0; i < props.letters.length; i++) {
    tiles.push(<WordleTile letter={props.letters[i]} evaluation={props.evaluation ? props.evaluation[i] : TileState.empty} key={i} />);
  }
  return <div className="wordle-row" data-tile-count={props.letters.length} data-selected={!!props.isSelected} onClick={props.onClick}>
    {tiles}
  </div>;
}

export function WordleBoard(props: {
  guesses: Array<{
    letters: string
    evaluation?: Array<TileState | CharEvaluation>
  }>
  selectedGuess?: number
  onGuessSelected?: (i: number) => void
}) {
  return <div className={"onGuessSelected" in props ? "wordle-board selectable" : "wordle-board"}>
    {props.guesses.map((guess, i) =>
      <WordleRow
        letters={guess.letters}
        evaluation={guess.evaluation}
        isSelected={props.selectedGuess === i}
        onClick={() => props.onGuessSelected(i)}
        key={i} />
    )}
  </div>;
}
