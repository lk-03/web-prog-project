import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

// --- Reusable Components ---

const Marquee = ({ text }) => (
  <div className="retro-marquee">
    <marquee scrollamount="5" scrolldelay="50">{text}</marquee>
  </div>
);

const WindowContainer = ({ title, children }) => (
  <div className="border-window">
    <div className="title-bar">
      <span>{title}</span>
      <div className="title-bar-buttons">
        <button className="border-outset window-btn">_</button>
        <button className="border-outset window-btn">X</button>
      </div>
    </div>
    <div className="window-content">
      {children}
    </div>
  </div>
);

// --- Page Components ---

const Home = () => (
  <WindowContainer title="Index.html">
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'purple', fontFamily: '"Comic Sans MS", sans-serif' }}>
        Welcome to my digital sanctuary!
      </h2>
      <p>Select a destination from the left navigation bar to explore the mainframe.</p>
    </div>
  </WindowContainer>
);

const AboutUs = () => (
  <WindowContainer title="About_Me.txt">
    <div style={{ fontFamily: 'monospace', backgroundColor: 'white', padding: '1rem', border: '2px inset gray' }}>
      <h2 style={{ fontWeight: 'bold', borderBottom: '2px solid black', marginBottom: '0.5rem' }}>WHO AM I?</h2>
      <p>Just a cyber surfer riding the digital waves.</p>
      <p>I built this site using React and standard CSS!</p>
    </div>
  </WindowContainer>
);

// --- Tutorial Component with sub-nav and YouTube player ---

const TUTORIAL_VIDEOS = {
  html: 'HD13eq_Pmp8',
  css: 'wRNinF7YQqQ',
  js: 'lfmg-EJ8gm4',
};

const Tutorial = () => {
  const [activeTopic, setActiveTopic] = useState('html');
  const topics = ['html', 'css', 'js'];

  return (
    <WindowContainer title="Tutorials.chm">
      {/* Sub Navigation */}
      <div className="sub-nav">
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => setActiveTopic(topic)}
            className={`border-outset sub-nav-btn ${activeTopic === topic ? 'active border-inset' : ''}`}
          >
            {topic.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Video Player */}
      <div className="video-container border-inset">
        <iframe
          key={activeTopic}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${TUTORIAL_VIDEOS[activeTopic]}`}
          title={`${activeTopic.toUpperCase()} Tutorial`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Terminal-style label */}
      <div style={{ fontFamily: 'monospace', backgroundColor: 'black', color: '#00ff00', padding: '6px 10px', marginTop: '8px', fontSize: '0.8rem' }}>
        &gt; NOW PLAYING: {activeTopic.toUpperCase()}_TUTORIAL.EXE — FreeCodeCamp
      </div>
    </WindowContainer>
  );
};

// --- Webmaster Playground with sub-nav ---

const WebmasterPlayground = () => {
  const [html, setHtml] = useState(() => localStorage.getItem('retro_html') || '<marquee>I am learning to code!</marquee>\n<h1>Hello Cyber World!</h1>');
  const [css, setCss] = useState(() => localStorage.getItem('retro_css') || 'marquee {\n  color: #00FF00;\n  background: black;\n}\nh1 {\n  color: blue;\n  text-align: center;\n}');
  const [js, setJs] = useState(() => localStorage.getItem('retro_js') || '// JavaScript goes here\nconsole.log("Hacking the mainframe...");');
  const [activeTab, setActiveTab] = useState('html');

  const srcDoc = `
    <html>
      <head><style>${css}</style></head>
      <body>${html}<script>${js}<\/script></body>
    </html>
  `;

  const tabs = ['html', 'css', 'js', 'output'];

  const saveToFloppy = () => {
    localStorage.setItem('retro_html', html);
    localStorage.setItem('retro_css', css);
    localStorage.setItem('retro_js', js);
    alert("💾 BEEP BOOP! Code successfully saved to Floppy Disk!");
  };

  return (
    <WindowContainer title="TryOut_Compiler.exe">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Sub Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="sub-nav">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-outset sub-nav-btn ${activeTab === tab ? 'active border-inset' : ''}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={saveToFloppy} className="border-outset window-btn" style={{ width: 'auto', padding: '4px 8px', marginBottom: '4px' }}>
            💾 SAVE
          </button>
        </div>

        {/* Editor Area */}
        <div className="border-inset editor-container">
          {activeTab === 'html' && (
            <textarea value={html} onChange={(e) => setHtml(e.target.value)} className="code-textarea html-text" spellCheck="false" />
          )}
          {activeTab === 'css' && (
            <textarea value={css} onChange={(e) => setCss(e.target.value)} className="code-textarea css-text" spellCheck="false" />
          )}
          {activeTab === 'js' && (
            <textarea value={js} onChange={(e) => setJs(e.target.value)} className="code-textarea js-text" spellCheck="false" />
          )}
          {activeTab === 'output' && (
            <iframe srcDoc={srcDoc} title="output" sandbox="allow-scripts" style={{ width: '100%', height: '100%', backgroundColor: 'white', border: 'none' }} />
          )}
        </div>
      </div>
    </WindowContainer>
  );
};

// --- Pixel Art Canvas ---

const GRID_SIZE = 32;
const CELL_SIZE = 14;

const PixelCanvas = () => {
  const [grid, setGrid] = useState(() => Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'));
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const canvasRef = useRef(null);

  const palette = [
    '#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00',
    '#ff00ff','#00ffff','#ff8800','#8800ff','#00ff88','#ff0088',
    '#884400','#008844','#000088','#888888',
  ];

  const paintCell = useCallback((index) => {
    setGrid(prev => {
      const next = [...prev];
      next[index] = isEraser ? '#ffffff' : selectedColor;
      return next;
    });
  }, [selectedColor, isEraser]);

  const handleMouseDown = (index) => {
    setIsPainting(true);
    paintCell(index);
  };

  const handleMouseEnter = (index) => {
    if (isPainting) paintCell(index);
  };

  const handleMouseUp = () => setIsPainting(false);

  const clearCanvas = () => setGrid(Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'));

  const downloadArt = () => {
    const canvas = document.createElement('canvas');
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    const ctx = canvas.getContext('2d');
    grid.forEach((color, i) => {
      const x = (i % GRID_SIZE) * CELL_SIZE;
      const y = Math.floor(i / GRID_SIZE) * CELL_SIZE;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    });
    const link = document.createElement('a');
    link.download = 'pixel_art.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveAsSticker = () => {
    const canvas = document.createElement('canvas');
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    const ctx = canvas.getContext('2d');
    grid.forEach((color, i) => {
      const x = (i % GRID_SIZE) * CELL_SIZE;
      const y = Math.floor(i / GRID_SIZE) * CELL_SIZE;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    });
    const dataURL = canvas.toDataURL('image/png');
    const saved = JSON.parse(localStorage.getItem('custom_stickers') || '[]');
    saved.push(dataURL);
    localStorage.setItem('custom_stickers', JSON.stringify(saved));
    alert('💾 Sticker saved to your Sticker Board!');
  };

  return (
    <WindowContainer title="PixelArt_Studio.exe">
      {/* Toolbar */}
      <div className="pixel-toolbar">
        <div className="pixel-palette">
          {palette.map(color => (
            <div
              key={color}
              className={`palette-cell border-outset ${selectedColor === color && !isEraser ? 'palette-active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => { setSelectedColor(color); setIsEraser(false); }}
            />
          ))}
        </div>
        <input type="color" value={selectedColor} onChange={e => { setSelectedColor(e.target.value); setIsEraser(false); }} className="border-inset color-picker" title="Custom Color" />
        <button className={`border-outset pixel-btn ${isEraser ? 'border-inset' : ''}`} onClick={() => setIsEraser(e => !e)}>🧹 ERASER</button>
        <button className="border-outset pixel-btn" onClick={clearCanvas}>🗑️ CLEAR</button>
        <button className="border-outset pixel-btn" onClick={downloadArt}>⬇️ DOWNLOAD</button>
        <button className="border-outset pixel-btn sticker-save-btn" onClick={saveAsSticker}>📌 SAVE AS STICKER</button>
      </div>

      {/* Grid */}
      <div
        className="pixel-grid border-inset"
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
      >
        {grid.map((color, i) => (
          <div
            key={i}
            className="pixel-cell"
            style={{ width: CELL_SIZE, height: CELL_SIZE, backgroundColor: color }}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
          />
        ))}
      </div>
    </WindowContainer>
  );
};

// --- Sticker Board ---

const PRESET_STICKERS = Array.from({ length: 16 }, (_, i) => `/stickers/sticker${i + 1}.jpg`);

const StickerBoard = () => {
  const [placedStickers, setPlacedStickers] = useState([]);
  const [customStickers, setCustomStickers] = useState(() => JSON.parse(localStorage.getItem('custom_stickers') || '[]'));
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  const allStickers = [...PRESET_STICKERS, ...customStickers];

  const addSticker = (src) => {
    setPlacedStickers(prev => [...prev, { id: Date.now(), src, x: 80, y: 80 }]);
  };

  const handleMouseDown = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(id);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left - dragOffset.x;
    const y = e.clientY - boardRect.top - dragOffset.y;
    setPlacedStickers(prev => prev.map(s => s.id === dragging ? { ...s, x, y } : s));
  }, [dragging, dragOffset]);

  const handleMouseUp = () => setDragging(null);

  const removeSticker = (id) => setPlacedStickers(prev => prev.filter(s => s.id !== id));

  const clearBoard = () => setPlacedStickers([]);

  const refreshCustom = () => setCustomStickers(JSON.parse(localStorage.getItem('custom_stickers') || '[]'));

  return (
    <WindowContainer title="StickerBoard.exe">
      <div className="sticker-layout">
        {/* Board Area */}
        <div
          ref={boardRef}
          className="sticker-board border-inset"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="sticker-board-hint">Drop stickers from the panel below!</div>
          {placedStickers.map(sticker => (
            <div
              key={sticker.id}
              className="placed-sticker"
              style={{ left: sticker.x, top: sticker.y }}
              onMouseDown={(e) => handleMouseDown(e, sticker.id)}
              onDoubleClick={() => removeSticker(sticker.id)}
              title="Double-click to remove"
            >
              <img src={sticker.src} alt="sticker" draggable={false} />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="sticker-controls">
          <button className="border-outset pixel-btn" onClick={clearBoard}>🗑️ CLEAR BOARD</button>
          <button className="border-outset pixel-btn" onClick={refreshCustom}>🔄 REFRESH</button>
        </div>

        {/* Sticker Panel */}
        <div className="sticker-panel border-inset">
          <div className="sticker-panel-label">📦 STICKER PACK — Click to place!</div>
          <div className="sticker-panel-scroll">
            {allStickers.map((src, i) => (
              <div key={i} className="sticker-thumb border-outset" onClick={() => addSticker(src)} title="Click to add">
                <img src={src} alt={`sticker ${i + 1}`} draggable={false} onError={e => { e.target.style.display = 'none'; }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowContainer>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return <Home />;
      case 'canvas': return <PixelCanvas />;
      case 'stickers': return <StickerBoard />;
      case 'tutorial': return <Tutorial />;
      case 'tryout': return <WebmasterPlayground />;
      case 'about': return <AboutUs />;
      default: return <Home />;
    }
  };

  const navLinks = [
    { id: 'home', label: '🏠 HOME' },
    { id: 'canvas', label: '🎨 CANVAS' },
    { id: 'stickers', label: '📌 STICKER BOARD' },
    { id: 'tutorial', label: '📺 TUTORIALS' },
    { id: 'tryout', label: '💻 TRY OUT' },
    { id: 'about', label: '👤 ABOUT US' },
  ];

  return (
    <div className="desktop-bg" onMouseUp={() => {}}>
      <div className="max-width-wrapper">

        {/* Header */}
        <div className="mega-header">
          <h1 className="gradient-text">CyberSurfer99's Mega Zone</h1>
        </div>

        <Marquee text="🌟🔥 TIP: CHECK OUT THE NEW 'TRY OUT' TAB TO CODE DIRECTLY IN YOUR BROWSER! 🔥🌟 NEW: PIXEL ART CANVAS + STICKER BOARD UNLOCKED! 🎨📌🌟" />

        {/* Main layout: sidebar + content */}
        <div className="app-body">

          {/* Vertical Nav Sidebar */}
          <nav className="border-outset side-nav">
            <div className="side-nav-title border-inset">NAVIGATE</div>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`border-outset side-nav-btn ${currentPage === link.id ? 'active border-inset' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Page Content */}
          <div className="content-area">
            {renderContent()}
          </div>

        </div>

        {/* Footer */}
        <div className="border-outset" style={{ textAlign: 'center', padding: '8px', marginTop: '2rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
          <p>Created by CyberSurfer99. Styled with standard CSS.</p>
          <p style={{ opacity: 0.7, marginTop: '4px' }}>Hosted on an Arch Linux server (btw).</p>
        </div>

      </div>
    </div>
  );
}
