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
      </header>
    </div>
  );
}

export default App;
