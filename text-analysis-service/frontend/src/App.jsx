import React from 'react';
import Analyzer from './pages/Analyzer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>English Text Analysis Service</h1>
        <p>Analyze English text with POS tagging, dependency parsing, and grammar analysis</p>
      </header>
      <main>
        <Analyzer />
      </main>
    </div>
  );
}

export default App;

