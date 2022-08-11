import { useState } from "react";
import { GAMES } from "./games";
import WordleRow, { TileState } from "./WordleRow";


export default function WordSpy(props: {}) {
  const [game, setGame] = useState<string>(GAMES["wordle"].id);
  const [inputMethod, setInputMethod] = useState<string>(null);
  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  const [idOrDate, setIdOrDate] = useState<number | Date>(yesterday);

  let id: number;
  let date: Date;
  if (idOrDate instanceof Date) {
    id = GAMES[game].getIdOnDate(idOrDate);
    date = idOrDate;
  } else {
    id = idOrDate;
    date = GAMES[game].getDateById(idOrDate);
  }
  const word = GAMES[game].getWordById(id);

  return <div>
    <select onChange={e => {setIdOrDate(date); setGame(e.target.value); }}>
      {Object.values(GAMES).map(game => <option value={game.id} key={game.id}>{game.name}</option>)}
    </select>
    <span> on </span>
    <input type="date" value={date.toISOString().substring(0, 10)} onChange={e => setIdOrDate(e.target.valueAsDate)} />
    <span> with ID </span>
    <input type="number" value={id} onChange={e => setIdOrDate(e.target.valueAsNumber)} />
    :
    {word ? <WordleRow letters={word} states={Array(word.length).fill(word ? TileState.correct : TileState.empty)} /> : null}
  </div>;
}
