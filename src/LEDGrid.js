// src/LEDGrid.js
import React, { useState } from 'react';
import './LEDGrid.css';
import { saveAs } from 'file-saver';

const LEDGrid = ({ rows, cols }) => {
  const [grid, setGrid] = useState(
    Array(rows).fill().map(() => Array(cols).fill({
      leds: [false, false, false, false],
      values: ["0000", "0000", "0000", "0000"]
    }))
  );
  const [contextMenu, setContextMenu] = useState(null);

  const toggleLED = (row, col, ledIndex) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          const newLeds = [...c.leds];
          newLeds[ledIndex] = !newLeds[ledIndex];
          return { ...c, leds: newLeds };
        }
        return c;
      })
    );
    setGrid(newGrid);
  };

  const shiftLeft = () => {
    const newGrid = grid.map(row => {
      const newRow = [...row.slice(1), {
        leds: [false, false, false, false],
        values: ["0000", "0000", "0000", "0000"]
      }];
      return newRow;
    });
    setGrid(newGrid);
  };

  const shiftRight = () => {
    const newGrid = grid.map(row => {
      const newRow = [{
        leds: [false, false, false, false],
        values: ["0000", "0000", "0000", "0000"]
      }, ...row.slice(0, -1)];
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

  const saveGridToFile = () => {
    const blob = new Blob([JSON.stringify(grid)], { type: 'application/json' });
    saveAs(blob, 'grid-state.json');
  };

  const loadGridFromFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const loadedGrid = JSON.parse(e.target.result);
      setGrid(loadedGrid);
      // Reset the file input value to allow the same file to be selected again
      event.target.value = null;
    };
    reader.readAsText(file);
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
                onContextMenu={(event) => handleContextMenu(event, rowIndex, colIndex)}
              >
                {cell.leds.map((isOn, ledIndex) => (
                  <div
                    key={ledIndex}
                    className={`led ${isOn ? 'on' : 'off'}`}
                    onClick={() => toggleLED(rowIndex, colIndex, ledIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="led-grid-controls">
        <button onClick={shiftLeft}>Shift Left</button>
        <button onClick={shiftRight}>Shift Right</button>
        <button onClick={saveGridToFile}>Save Grid</button>
        <input type="file" onChange={loadGridFromFile} />
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