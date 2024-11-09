import React from 'react';
import './App.css';
import LEDGrid from './LEDGrid';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bitgrid - a novel  BITwise GRID-based Computation Model</h1>
        <LEDGrid rows={10} cols={10} />
      </header>
    </div>
  );
}

export default App;
