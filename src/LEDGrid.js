// src/LEDGrid.js
import React, { useState, useEffect } from 'react';
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
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 }); // Initialize with cell (0, 0) selected

  useEffect(() => {
    // Optionally, you can perform any additional actions when the component mounts
  }, []);

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

  const handleCellClick = (row, col, ledIndex) => {
    setSelectedCell({ row, col });
    toggleLED(row, col, ledIndex);
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

  const runPhaseA = () => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if ((rowIndex + colIndex) % 2 !== 0) {
          // Update the cell as needed for Phase A
          // first, get the value from the cell to the left
          const leftBit = colIndex > 0 ? (grid[rowIndex][colIndex - 1].leds[1] ? 1 : 0) : 0;
          // then, get the value from the cell to the right
          const rightBit = colIndex < cols - 1 ? (grid[rowIndex][colIndex + 1].leds[2] ? 1 : 0) : 0;
          // then get the bit from the cell above
          const topBit = rowIndex > 0 ? (grid[rowIndex - 1][colIndex].leds[3] ? 1 : 0) : 0;
          // then get the bit from the cell below
          const bottomBit = rowIndex < rows - 1 ? (grid[rowIndex + 1][colIndex].leds[0] ? 1 : 0) : 0;
          // then, calculate the new value for the cell
          const newValue = ((leftBit * 8) + (rightBit * 4) + (topBit * 2) + bottomBit);
          // program bits are the integer value of the hex string stored in value[0]
          const newLeds = cell.leds.map(led => led); // Example: toggle all LEDs in the cell
          newLeds[0] = (parseInt(cell.values[0], 16) >> newValue) & 1;
          // repeat for the other 3 leds
          newLeds[1] = (parseInt(cell.values[1], 16) >> newValue) & 1;
          newLeds[2] = (parseInt(cell.values[2], 16) >> newValue) & 1;
          newLeds[3] = (parseInt(cell.values[3], 16) >> newValue) & 1;
          return { ...cell, leds: newLeds };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const runPhaseB = () => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if ((rowIndex + colIndex) % 2 === 0) {
          // Update the cell as needed for Phase B
          const newLeds = cell.leds.map(led => !led); // Example: toggle all LEDs in the cell
          return { ...cell, leds: newLeds };
        }
        return cell;
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
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(event) => handleContextMenu(event, rowIndex, colIndex)}
              >
                {cell.leds.map((isOn, ledIndex) => (
                  <div
                    key={ledIndex}
                    className={`led ${isOn ? 'on' : 'off'}`}
                    onClick={() => handleCellClick(rowIndex, colIndex, ledIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="selected-cell-info">
        {selectedCell.row !== null && selectedCell.col !== null && (
          <p>Selected Cell: Row {selectedCell.row}, Column {selectedCell.col}</p>
        )}
      </div>      
      <div className="led-grid-controls">
        <button onClick={shiftLeft}>Shift Left</button>
        <button onClick={shiftRight}>Shift Right</button>
        <button onClick={saveGridToFile}>Save Grid</button>
        <button onClick={runPhaseA}>Phase A</button>
        <button onClick={runPhaseB}>Phase B</button>
        <label className="file-load-button">
          Load Grid
          <input type="file" onChange={loadGridFromFile} style={{ display: 'none' }} />
        </label>
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