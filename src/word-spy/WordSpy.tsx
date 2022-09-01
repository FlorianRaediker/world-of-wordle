import { useState } from "react";
import { DailyGame, Game, GAMES, WORDLE } from "../games";
import WordleRow, { TileState } from "../board";
import "./WordSpy.css";


export default function WordSpy(props: {}) {
  const [gameId, setGameId] = useState<string>(WORDLE.id);
  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  const [idOrDate, setIdOrDate] = useState<number | Date>(yesterday);
  const game: DailyGame = Game.byId(gameId) as DailyGame;

  let id: number;
  let date: Date;
  if (idOrDate === null) {
    id = null;
    date = null;
  } else if (idOrDate instanceof Date) {
    id = game.getIdOnDate(idOrDate);
    date = idOrDate;
  } else {
    id = idOrDate;
    date = game.getDateById(idOrDate);
  }
  const word = game.getSolutionById(id);

  return <div className="word-spy">
    <h2>Word Spy</h2>
    <div className="inputs">
      <div>
        <select onChange={e => { setIdOrDate(date); setGameId(e.target.value); }}>
          {GAMES.filter(game => game instanceof DailyGame).map(game => <option value={game.id} key={game.id}>{game.name}</option>)}
        </select>
      </div>
      <div>
        <span className="label">on</span>{" "}
        <input type="date" className="date-input" value={date ? date.toISOString().substring(0, 10) : null} onChange={e => setIdOrDate(e.target.valueAsDate)} />
      </div>
      <div>
        <span className="label">with ID</span>{" "}
        <input type="number" className="id-input" value={id ? id : ""} onChange={e => setIdOrDate(e.target.valueAsNumber ? e.target.valueAsNumber : null)} />
      </div>
    </div>
    <div className="result">
      {word ? <WordleRow letters={word} states={Array(word.length).fill(word ? TileState.correct : TileState.empty)} /> : null}
    </div>
  </div>;
}
