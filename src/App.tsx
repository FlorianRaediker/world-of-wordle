import { Link, Outlet } from "react-router-dom";
import './App.css';


export function App() {
  return <>
    <header>
      <Link to="/">
        <h1 className="header">
        <svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" ry="3"/><rect x="3" y="3" width="7" height="7" ry="1.75" fill="#b59f3b"/><g fill="#fff"><rect x="12.5" y="3" width="7" height="7" ry="1.75"/><rect x="22" y="3" width="7" height="7" ry="1.75"/><rect x="3" y="12.5" width="7" height="7" ry="1.75"/><rect x="12.5" y="12.5" width="7" height="7" ry="1.75"/></g><g fill="#538d4e"><rect x="22" y="12.5" width="7" height="7" ry="1.75"/><rect x="22" y="22" width="7" height="7" ry="1.75"/><rect x="12.5" y="22" width="7" height="7" ry="1.75"/><rect x="3" y="22" width="7" height="7" ry="1.75"/></g></svg>
          {" "}
          World of Wordle
        </h1>
      </Link>
    </header>
    <main className="main">
      <Outlet />
    </main>
    <footer className="footer">
      <p>© 2022 Florian Rädiker</p>
      <a className="github-link" href="https://github.com/FlorianRaediker/world-of-wordle" target="_blank" rel="noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>
    </footer>
  </>;
}

function NavItem(props: { children, to: string }) {
  return (
    <Link to={props.to} className="nav-item">
      {props.children}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
      </svg>
    </Link>
  );
}

export function AppNavigation() {
  return <>
    <p className="tagline">non-cheating tools for Wordle and its many variants</p>
    <div className="nav">
      <NavItem to="/games">
        <div><b>World of Wordle</b></div>
        List of all supported Wordle variants
      </NavItem>
      <NavItem to="/word-spy">
        <div><b>Word Spy</b></div>
        What was the Wordle on April 1st again?
      </NavItem>
      <NavItem to="/reconstructor">
        <div><b>Wordle Reconstructor</b></div>
        Reconstruct guesses given a game's shareable result
      </NavItem>
    </div>
  </>
}
