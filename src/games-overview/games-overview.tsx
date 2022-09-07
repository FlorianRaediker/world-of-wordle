import { DailyGame, GAMES, HardMode } from "../games";
import "./games-overview.css";


export default function GamesOverview() {
  return <div className="games-overview">
    {GAMES.map(game => {
      let tags = [];
      if (game instanceof DailyGame) {
        tags.push({ name: "Daily", id: "daily" });
      }
      if (game.hardMode === HardMode.Lax) {
        tags.push({ name: "Lax Hard Mode", id: "lax-hard-mode" });
      } else if (game.hardMode === HardMode.Strict) {
        tags.push({ name: "Strict Hard Mode", id: "strict-hard-mode" });
      }
      if (game.info.hasDarkTheme) {
        tags.push({ name: "Dark Theme", id: "dark-theme" });
      }
      if (game.info.hasColorblindTheme) {
        tags.push({ name: "High Contrast", id: "colorblind-theme" });
      }
      return <div className="game" key={game.id}>
        <a className="anchor-header game-name" href={"#" + game.id} id={game.id}>
          <img className="game-icon" src={game.info.icon || `https://external-content.duckduckgo.com/ip3/${new URL(game.info.url).hostname}.ico`} />
          {" "}
          {game.info.name}
        </a>
        <a className="link external" href={game.info.url} target="_blank" rel="noopener noreferrer">{game.info.url.replace(/^https?:\/\//, "")}</a>
        <p>{game instanceof DailyGame ? <span className="since">Since {game.startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span> : null}</p>
        <p>{game instanceof DailyGame && game.getEndDate() ? <span className="since">Discontinued {game.getEndDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span> : null}</p>
        <div className="tags">{tags.map(tag => <span key={tag.id}><span className="tag" data-tag-id={tag.id}>{tag.name}</span>{" "}</span>)}</div>
      </div>;
    })}
  </div>
}
