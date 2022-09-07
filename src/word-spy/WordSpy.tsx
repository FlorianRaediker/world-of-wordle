import { useEffect, useRef, useState } from "react";
import { DailyGame, Game, GAMES, WORDLE } from "../games";
import { TileState, WordleRow } from "../board";
import "./WordSpy.css";


export default function WordSpy(props: {}) {
  const [gameId, setGameId] = useState<string>(WORDLE.id);
  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  const [idOrDate, setIdOrDate] = useState<number | Date>(yesterday);
  const game: DailyGame = Game.byId(gameId) as DailyGame;
  const [showAll, setShowAll] = useState<number>(0); /* 0: hide all, 1: show all, 2: show all & has scrolled into view */

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

  let result;
  if (date > yesterday) {
    result = "This time machine only travels back in time! Everything else would be cheating, right?";
  } else {
    const word = game.getSolutionById(id);
    if (word) {
      result = <WordleRow letters={word} evaluation={Array(word.length).fill(word ? TileState.correct : TileState.empty)} />;
    } else {
      result = "No " + game.info.name + (idOrDate instanceof Date ? " on this date!" : " with this id!");
    }
  }

  const showAllToggleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showAll === 1) {
      showAllToggleRef.current.scrollIntoView({ behavior: "smooth" });
      setShowAll(2);
    }
  }, [showAll]);

  return <div className="word-spy">
    <h2>Word Spy</h2>
    <div className="inputs">
      <div>
        <select onChange={e => { setIdOrDate(date); setGameId(e.target.value); }}>
          {GAMES.filter(game => game instanceof DailyGame).map(game => <option value={game.id} key={game.id}>{game.info.name}</option>)}
        </select>
      </div>
      <div>
        <span className="label">on</span>{" "}
        <input type="date" className="date-input" value={date ? date.toISOString().substring(0, 10) : ""} onChange={e => setIdOrDate(e.target.valueAsDate)} />
      </div>
      <div>
        <span className="label">with ID</span>{" "}
        <input type="number" className="id-input" value={id != null ? id : ""} onChange={e => setIdOrDate(e.target.valueAsNumber)} />
      </div>
    </div>
    <div className="result">
      {result}
    </div>
    <div className="show-all-toggle-container" ref={showAllToggleRef}>
      <span className="show-all-toggle" onClick={() => setShowAll(showAll ? 0 : 1)}>
        {showAll ?
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="3 3 10 10">
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
            </svg>{" "}
            Hide all past solutions
          </> :
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="3 3 10 10">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>{" "}
            Show all past solutions
          </>}
      </span>
    </div>
    <div className="all-solutions">
      {showAll ?
        <>
          {game.getPastSolutionsByMonth(yesterday).reverse().map(({ firstDate, firstId, words }) =>
            <div key={firstDate.toString()}>
              <h3>{firstDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
              <ul>
                {words.reverse().map((word, i, words) => {
                  i = words.length - 1 - i;
                  const date = new Date(firstDate);
                  date.setUTCDate(date.getUTCDate() + i);
                  return <li key={i}>#{firstId + i} – {date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}: <span className="text-solution">{word}</span></li>;
                })}
              </ul>
            </div>
          )}
        </>
        : null
      }
    </div>
  </div>;
}
