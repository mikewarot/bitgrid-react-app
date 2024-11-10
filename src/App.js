import React from 'react';
import './App.css';
import LEDGrid from './LEDGrid';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bitgrid - a novel  BITwise GRID-based Computation Model</h1>
        <LEDGrid rows={10} cols={10} />
        <h2><a href="https://github.com/mikewarot/bitgrid-react-app">GitHub repository</a></h2>
        You can long press (on a smartphone) or right click (on a computer) to see the context menu, and set the programming for a bitgrid cell
      </header>
    </div>
  );
}

export default App;
