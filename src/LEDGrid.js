// src/LEDGrid.js
import React, { useState } from 'react';
import './LEDGrid.css';

const LEDGrid = ({ rows, cols }) => {
  const [grid, setGrid] = useState(
    Array(rows).fill().map(() => Array(cols).fill({ isOn: false, values: ["0000", "0000", "0000", "0000"] }))
  );
  const [contextMenu, setContextMenu] = useState(null);

  const toggleLED = (row, col) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? { ...c, isOn: !c.isOn } : c))
    );
    setGrid(newGrid);
  };

  const shiftLeft = () => {
    const newGrid = grid.map(row => {
      const newRow = [...row.slice(1), { isOn: false, values: ["0000", "0000", "0000", "0000"] }];
      return newRow;
    });
    setGrid(newGrid);
  };

  const shiftRight = () => {
    const newGrid = grid.map(row => {
      const newRow = [{ isOn: false, values: ["0000", "0000", "0000", "0000"] }, ...row.slice(0, -1)];
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

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const { row, col } = contextMenu;
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          const newValues = [...c.values];
          newValues[index] = value;
          return { ...c, values: newValues };
        }
        return c;
      })
    );
    setGrid(newGrid);
  };

  return (
    <div className="led-grid-container">
      <div className="led-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="led-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="led-cluster"
                onClick={() => toggleLED(rowIndex, colIndex)}
                onContextMenu={(event) => handleContextMenu(event, rowIndex, colIndex)}
              >
                <div className={`led ${cell.isOn ? 'on' : 'off'}`} />
                <div className={`led ${cell.isOn ? 'on' : 'off'}`} />
                <div className={`led ${cell.isOn ? 'on' : 'off'}`} />
                <div className={`led ${cell.isOn ? 'on' : 'off'}`} />
              </div>
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
          {grid[contextMenu.row][contextMenu.col].values.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              maxLength="4"
              onChange={(event) => handleInputChange(event, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LEDGrid;