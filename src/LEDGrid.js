// src/LEDGrid.js
import React, { useState } from 'react';
import './LEDGrid.css';

const LEDGrid = ({ rows, cols }) => {
  const [grid, setGrid] = useState(
    Array(rows).fill().map(() => Array(cols).fill(false))
  );
  const [contextMenu, setContextMenu] = useState(null);

  const toggleLED = (row, col) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? !c : c))
    );
    setGrid(newGrid);
  };

  const shiftLeft = () => {
    const newGrid = grid.map(row => {
      const newRow = [...row.slice(1), false];
      return newRow;
    });
    setGrid(newGrid);
  };

  const shiftRight = () => {
    const newGrid = grid.map(row => {
      const newRow = [false, ...row.slice(0, -1)];
      return newRow;
    });
    setGrid(newGrid);
  };

  const handleContextMenu = (event, row, col) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      row,
      col,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <div className="led-grid-container">
      <div className="led-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="led-row">
            {row.map((isOn, colIndex) => (
              <div
                key={colIndex}
                className={`led ${isOn ? 'on' : 'off'}`}
                onClick={() => toggleLED(rowIndex, colIndex)}
                onContextMenu={(event) => handleContextMenu(event, rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="led-grid-controls">
        <button onClick={shiftLeft}>Shift Left</button>
        <button onClick={shiftRight}>Shift Right</button>
      </div>
      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          onMouseLeave={handleClose}
        >
          <button onClick={() => toggleLED(contextMenu.row, contextMenu.col)}>Toggle LED</button>
        </div>
      )}
    </div>
  );
};

export default LEDGrid;