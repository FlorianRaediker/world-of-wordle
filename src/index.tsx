import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App, AppNavigation } from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import WordleReconstructor from "./reconstructor/Reconstructor";
import WordSpy from "./word-spy/WordSpy";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AppNavigation />} />
          <Route path="word-spy" element={<WordSpy />} />
          <Route path="reconstructor" element={
            <>
              <h2>Wordle Reconstructor</h2>
              <WordleReconstructor />
            </>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
