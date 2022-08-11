import { useState } from 'react';
import './App.css';
import WordleReconstructor from "./Reconstructor";
import WordSpy from "./WordSpy";


export default function App() {
  return (
    <div>
      <WordSpy />
      <WordleReconstructor />
    </div>
  );
}
