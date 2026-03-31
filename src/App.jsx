// Mod 6: React Components — Root App component
// Mod 7: React State — page routing via useState
import React, { useState, useRef, useCallback } from 'react';
import './App.css';

import WindowContainer from './components/WindowContainer';
import Tutorials      from './components/Tutorials';
import PixelArtStudio from './components/PixelArtStudio';
import Gallery        from './components/Gallery';

// --- Reusable Components ---

const Marquee = ({ text }) => (
  <div className="retro-marquee">
    <marquee scrollamount="5" scrolldelay="50">{text}</marquee>
  </div>
);

// --- Static Page Components ---

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

// --- Sticker Board ---

const PRESET_STICKERS = Array.from({ length: 16 }, (_, i) => `/stickers/sticker${i + 1}.jpg`);

const StickerBoard = () => {
  const [placedStickers, setPlacedStickers] = useState([]);
  const [customStickers, setCustomStickers] = useState(() =>
    JSON.parse(localStorage.getItem('custom_stickers') || '[]')
  );
  const [dragging, setDragging]     = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  const allStickers = [...PRESET_STICKERS, ...customStickers];

  const addSticker = (src) =>
    setPlacedStickers(prev => [...prev, { id: Date.now(), src, x: 80, y: 80 }]);

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
    const y = e.clientY - boardRect.top  - dragOffset.y;
    setPlacedStickers(prev => prev.map(s => s.id === dragging ? { ...s, x, y } : s));
  }, [dragging, dragOffset]);

  const handleMouseUp   = () => setDragging(null);
  const removeSticker   = (id) => setPlacedStickers(prev => prev.filter(s => s.id !== id));
  const clearBoard      = () => setPlacedStickers([]);
  const refreshCustom   = () =>
    setCustomStickers(JSON.parse(localStorage.getItem('custom_stickers') || '[]'));

  return (
    <WindowContainer title="StickerBoard.exe">
      <div className="sticker-layout">
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

        <div className="sticker-controls">
          <button className="border-outset pixel-btn" onClick={clearBoard}>🗑️ CLEAR BOARD</button>
          <button className="border-outset pixel-btn" onClick={refreshCustom}>🔄 REFRESH</button>
        </div>

        <div className="sticker-panel border-inset">
          <div className="sticker-panel-label">📦 STICKER PACK — Click to place!</div>
          <div className="sticker-panel-scroll">
            {allStickers.map((src, i) => (
              <div key={i} className="sticker-thumb border-outset" onClick={() => addSticker(src)} title="Click to add">
                <img src={src} alt={`sticker ${i + 1}`} draggable={false}
                  onError={e => { e.target.style.display = 'none'; }} />
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
  // Mod 7: React State — drives page routing
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    switch (currentPage) {
      case 'home':     return <Home />;
      case 'canvas':   return <PixelArtStudio />;
      case 'stickers': return <StickerBoard />;
      case 'tutorial': return <Tutorials />;
      case 'gallery':  return <Gallery />;
      case 'about':    return <AboutUs />;
      default:         return <Home />;
    }
  };

  const navLinks = [
    { id: 'home',     label: '🏠 HOME' },
    { id: 'canvas',   label: '🎨 CANVAS' },
    { id: 'stickers', label: '📌 STICKER BOARD' },
    { id: 'tutorial', label: '📺 TUTORIALS' },
    { id: 'gallery',  label: '🖼 GALLERY' },
    { id: 'about',    label: '👤 ABOUT US' },
  ];

  return (
    <div className="desktop-bg">
      <div className="max-width-wrapper">

        <div className="mega-header">
          <h1 className="gradient-text">Mossaico</h1>
        </div>

        <Marquee text="🌟🔥 WELCOME TO MOSSAICO — PIXEL ART STUDIO + GALLERY + STICKER BOARD UNLOCKED! 🎨📌🖼🌟" />

        <div className="app-body">
          {/* Mod 3: CSS — sticky vertical sidebar nav */}
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

          <div className="content-area">
            {renderContent()}
          </div>
        </div>

        <div className="border-outset" style={{ textAlign: 'center', padding: '8px', marginTop: '2rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
          <p>Created by CyberSurfer99 · Mossaico v2.0 · Styled with standard CSS.</p>
          <p style={{ opacity: 0.7, marginTop: '4px' }}>Hosted on an Arch Linux server (btw).</p>
        </div>

      </div>
    </div>
  );
}
