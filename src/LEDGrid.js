// src/LEDGrid.js
import React, { useState } from 'react';
import './LEDGrid.css';

const LEDGrid = ({ rows, cols }) => {
  const [grid, setGrid] = useState(
    Array(rows).fill().map(() => Array(cols).fill(false))
  );

  const toggleLED = (row, col) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? !c : c))
    );
    setGrid(newGrid);
  };

  return (
    <div className="led-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="led-row">
          {row.map((isOn, colIndex) => (
            <div
              key={colIndex}
              className={`led ${isOn ? 'on' : 'off'}`}
              onClick={() => toggleLED(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LEDGrid;