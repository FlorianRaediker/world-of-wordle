import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App, AppNavigation } from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Reconstructor from "./reconstructor/Reconstructor";
import WordSpy from "./word-spy/WordSpy";
import GamesOverview from "./games-overview/games-overview";


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AppNavigation />} />
          <Route path="games" element={<GamesOverview />} />
          <Route path="word-spy" element={<WordSpy />} />
          <Route path="reconstructor" element={<Reconstructor />} />
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
