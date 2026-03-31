// Mod 6: React Components — functional component, colocated logic
// Mod 7: React State — useState for grid, tools, colors
// Mod 8: Canvas API — off-screen canvas for download/sticker export
import React, { useState, useRef, useCallback } from 'react';
import WindowContainer from './WindowContainer';

const GRID_SIZE = 32;
const CELL_SIZE = 14;

// Mod 3: CSS — 16 preset palette colors
const PALETTE = [
  '#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00',
  '#ff00ff','#00ffff','#ff8800','#8800ff','#00ff88','#ff0088',
  '#884400','#008844','#000088','#888888',
];

// Mod 8: Flood Fill Algorithm — iterative BFS to fill contiguous same-color cells
const floodFill = (grid, startIndex, targetColor, fillColor) => {
  if (targetColor === fillColor) return grid;
  const newGrid = [...grid];
  const stack = [startIndex];
  const visited = new Set();

  while (stack.length > 0) {
    const idx = stack.pop();
    if (idx < 0 || idx >= GRID_SIZE * GRID_SIZE) continue;
    if (visited.has(idx)) continue;
    if (newGrid[idx] !== targetColor) continue;

    visited.add(idx);
    newGrid[idx] = fillColor;

    const col = idx % GRID_SIZE;
    const row = Math.floor(idx / GRID_SIZE);

    // Push neighbours (up, down, left, right)
    if (row > 0) stack.push(idx - GRID_SIZE);
    if (row < GRID_SIZE - 1) stack.push(idx + GRID_SIZE);
    if (col > 0) stack.push(idx - 1);
    if (col < GRID_SIZE - 1) stack.push(idx + 1);
  }

  return newGrid;
};

// Mod 8: Line Drawing — Bresenham's line algorithm returns array of cell indices
const getLineIndices = (x0, y0, x1, y1) => {
  const indices = [];
  let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;

  while (true) {
    if (x0 >= 0 && x0 < GRID_SIZE && y0 >= 0 && y0 < GRID_SIZE) {
      indices.push(y0 * GRID_SIZE + x0);
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return indices;
};

// Mod 8: Brush — returns indices of all cells covered by brush around center
const getBrushIndices = (index, brushSize) => {
  const indices = new Set();
  const cx = index % GRID_SIZE;
  const cy = Math.floor(index / GRID_SIZE);
  const half = Math.floor(brushSize / 2);

  for (let dy = -half; dy <= half; dy++) {
    for (let dx = -half; dx <= half; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
        indices.add(ny * GRID_SIZE + nx);
      }
    }
  }
  return [...indices];
};

// Mod 6: React Components — main PixelArtStudio component
const PixelArtStudio = () => {
  // Mod 7: React State — grid of hex color strings
  const [grid, setGrid] = useState(() => Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'));
  const [selectedColor, setSelectedColor] = useState('#000000');

  // Mod 7: React State — active tool: 'pen' | 'eraser' | 'fill' | 'line'
  const [activeTool, setActiveTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(1);

  // Mod 7: React State — line tool state
  const [isPainting, setIsPainting] = useState(false);
  const [lineStart, setLineStart] = useState(null);
  const [linePreview, setLinePreview] = useState([]);

  const getColor = () => activeTool === 'eraser' ? '#ffffff' : selectedColor;

  // Mod 7: React State — paint cells using brush
  const paintCells = useCallback((index, currentGrid) => {
    const indices = getBrushIndices(index, brushSize);
    const color = getColor();
    const next = [...currentGrid];
    indices.forEach(i => { next[i] = color; });
    return next;
  }, [brushSize, activeTool, selectedColor]);

  const getIndexFromEvent = (e) => {
    const cell = e.currentTarget || e.target;
    return parseInt(cell.dataset.index, 10);
  };

  // Mod 5: DOM Events — mouse down handler, branches by tool
  const handleMouseDown = (e, index) => {
    e.preventDefault();
    if (activeTool === 'fill') {
      // Mod 8: Flood Fill — immediate on click
      setGrid(prev => floodFill(prev, index, prev[index], selectedColor));
      return;
    }
    if (activeTool === 'line') {
      setIsPainting(true);
      setLineStart(index);
      setLinePreview([index]);
      return;
    }
    setIsPainting(true);
    setGrid(prev => paintCells(index, prev));
  };

  // Mod 5: DOM Events — mouse enter for drag painting / line preview
  const handleMouseEnter = (e, index) => {
    if (!isPainting) return;

    if (activeTool === 'line' && lineStart !== null) {
      // Mod 8: Bresenham preview while dragging
      const x0 = lineStart % GRID_SIZE, y0 = Math.floor(lineStart / GRID_SIZE);
      const x1 = index % GRID_SIZE, y1 = Math.floor(index / GRID_SIZE);
      setLinePreview(getLineIndices(x0, y0, x1, y1));
      return;
    }

    if (activeTool !== 'fill') {
      setGrid(prev => paintCells(index, prev));
    }
  };

  // Mod 5: DOM Events — mouse up commits line to grid
  const handleMouseUp = (e, index) => {
    if (activeTool === 'line' && lineStart !== null && isPainting) {
      const x0 = lineStart % GRID_SIZE, y0 = Math.floor(lineStart / GRID_SIZE);
      const x1 = index % GRID_SIZE,     y1 = Math.floor(index / GRID_SIZE);
      const lineIndices = getLineIndices(x0, y0, x1, y1);
      const color = getColor();
      setGrid(prev => {
        const next = [...prev];
        lineIndices.forEach(i => { next[i] = color; });
        return next;
      });
      setLinePreview([]);
      setLineStart(null);
    }
    setIsPainting(false);
  };

  const handleGlobalMouseUp = () => {
    if (activeTool === 'line') {
      setLinePreview([]);
      setLineStart(null);
    }
    setIsPainting(false);
  };

  const clearCanvas = () => {
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'));
    setLinePreview([]);
  };

  // Mod 8: Canvas API — renders grid to off-screen canvas for download
  const exportCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    const ctx = canvas.getContext('2d');
    grid.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect((i % GRID_SIZE) * CELL_SIZE, Math.floor(i / GRID_SIZE) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    return canvas.toDataURL('image/png');
  };

  const downloadArt = () => {
    const link = document.createElement('a');
    link.download = 'pixel_art.png';
    link.href = exportCanvas();
    link.click();
  };

  // Mod 7: React State — saves pixel art as sticker to localStorage
  const saveAsSticker = () => {
    const dataURL = exportCanvas();
    const saved = JSON.parse(localStorage.getItem('custom_stickers') || '[]');
    saved.push(dataURL);
    localStorage.setItem('custom_stickers', JSON.stringify(saved));
    alert('📌 Sticker saved to your Sticker Board!');
  };

  const tools = [
    { id: 'pen',    label: '✏️ PEN' },
    { id: 'eraser', label: '🧹 ERASER' },
    { id: 'fill',   label: '🪣 FILL' },
    { id: 'line',   label: '📏 LINE' },
  ];

  const previewSet = new Set(linePreview);

  return (
    <WindowContainer title="PixelArt_Studio.exe">

      {/* TOOLBAR */}
      <div className="pixel-toolbar">

        {/* Color Palette — Mod 3: CSS Grid */}
        <div className="pixel-palette">
          {PALETTE.map(color => (
            <div
              key={color}
              className={`palette-cell border-outset ${selectedColor === color && activeTool !== 'eraser' ? 'palette-active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => { setSelectedColor(color); if (activeTool === 'eraser') setActiveTool('pen'); }}
            />
          ))}
        </div>

        {/* Custom color picker */}
        <input
          type="color"
          value={selectedColor}
          onChange={e => { setSelectedColor(e.target.value); setActiveTool('pen'); }}
          className="border-inset color-picker"
          title="Custom Color"
        />

        {/* Tool buttons — Mod 7: React State — active tool highlight */}
        <div className="pixel-tool-group">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`border-outset pixel-btn ${activeTool === tool.id ? 'border-inset pixel-btn-active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Brush Size — Mod 4: HTML — native select element */}
        <div className="brush-size-group">
          <label className="brush-label" htmlFor="brush-size">BRUSH:</label>
          <select
            id="brush-size"
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            className="border-inset brush-select"
            disabled={activeTool === 'fill' || activeTool === 'line'}
          >
            <option value={1}>1px</option>
            <option value={2}>2px</option>
            <option value={3}>3px</option>
            <option value={4}>4px</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="pixel-tool-group">
          <button className="border-outset pixel-btn" onClick={clearCanvas}>🗑️ CLEAR</button>
          <button className="border-outset pixel-btn" onClick={downloadArt}>⬇️ DOWNLOAD</button>
          <button className="border-outset pixel-btn sticker-save-btn" onClick={saveAsSticker}>📌 SAVE AS STICKER</button>
        </div>

      </div>

      {/* PIXEL GRID — Mod 5: DOM Events — mouse handlers on each cell */}
      <div
        className="pixel-grid border-inset"
        onMouseLeave={handleGlobalMouseUp}
        onMouseUp={handleGlobalMouseUp}
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
      >
        {grid.map((color, i) => {
          const isPreview = previewSet.has(i);
          return (
            <div
              key={i}
              data-index={i}
              className="pixel-cell"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: isPreview ? getColor() : color,
                opacity: isPreview ? 0.6 : 1,
              }}
              onMouseDown={(e) => handleMouseDown(e, i)}
              onMouseEnter={(e) => handleMouseEnter(e, i)}
              onMouseUp={(e) => handleMouseUp(e, i)}
            />
          );
        })}
      </div>

      {/* Status bar */}
      <div className="pixel-status border-inset">
        <span>TOOL: {activeTool.toUpperCase()}</span>
        <span>BRUSH: {brushSize}px</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          COLOR:
          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: selectedColor, border: '1px solid black' }} />
          {selectedColor}
        </span>
        <span>GRID: {GRID_SIZE}×{GRID_SIZE}</span>
      </div>

    </WindowContainer>
  );
};

export default PixelArtStudio;
