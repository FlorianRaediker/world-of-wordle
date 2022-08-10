import { useState } from 'react';
import './App.css';
import WordleReconstructor from "./WordleReconstructor";


export default function App() {
  const [letters, setLetters] = useState<string>();
  return (
    /*<div>
      <label htmlFor="wordle-date">Wordle on </label>
      <input type="date" id="wordle-date" onChange={e => {
        const wordle = getWordleOnDate(e.target.valueAsDate);
        setLetters(wordle ? wordle : "     ");
      }} />:
      {letters ? <WordleRow letters={letters} states={Array(letters.length).fill(letters === "     " ? TileState.empty : TileState.correct)} /> : null}
    </div>*/
    <WordleReconstructor />
  );
}
