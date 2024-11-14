import React from 'react';
import './App.css';
import LEDGrid from './LEDGrid';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>BitGrid Simulator</title>
      </Helmet>
      <header className="App-header">
        <LEDGrid rows={10} cols={10} />
        <h2><a href="https://github.com/mikewarot/bitgrid-react-app">GitHub repository</a></h2>
        You can long press (on a smartphone) or right click (on a computer) to see the context menu, and set the programming for a bitgrid cell
      </header>
    </div>
  );
}

export default App;
