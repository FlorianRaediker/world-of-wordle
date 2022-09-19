import React, { ComponentType, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App, AppNavigation } from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Reconstructor from "./reconstructor/Reconstructor";
import WordSpy from "./word-spy/WordSpy";
import GamesOverview from "./games-overview/games-overview";


function withTitle<T>(Component: ComponentType<T>, title: string) {
  return function (props: T) {
    useEffect(() => {
      document.title = title;
    });
    return <Component {...props} />;
  }
}


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const AppNavigationWithTitle = withTitle(AppNavigation, "World of Wordle");
const GamesOverviewWithTitle = withTitle(GamesOverview, "Games | World of Wordle");
const WordSpyWithTitle = withTitle(WordSpy, "Word Spy | World of Wordle");
const ReconstructorWithTitle = withTitle(Reconstructor, "Wordle Reconstructor | World of Wordle");

root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AppNavigationWithTitle />} />
          <Route path="games" element={<GamesOverviewWithTitle />} />
          <Route path="word-spy" element={<WordSpyWithTitle />} />
          <Route path="reconstructor" element={<ReconstructorWithTitle />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
