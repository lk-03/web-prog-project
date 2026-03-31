// Mod 6: React Components — functional component
// Mod 3: CSS Properties — CSS column-count masonry, no external libraries
import React, { useState } from 'react';
import WindowContainer from './WindowContainer';

// Mod 7: React State — static gallery data, varied heights for masonry effect
// Images sourced from picsum.photos (free CDN) with pixel-art style low-res seeds
const GALLERY_ITEMS = [
  { id: 1,  src: 'https://picsum.photos/seed/pixeltown/160/160',    title: 'Pixel Town',        tag: 'landscape' },
  { id: 2,  src: 'https://picsum.photos/seed/retrosky/160/240',     title: 'Retro Sky',         tag: 'sky' },
  { id: 3,  src: 'https://picsum.photos/seed/neoncat/160/120',      title: 'Neon Cat',          tag: 'character' },
  { id: 4,  src: 'https://picsum.photos/seed/dungeon1/160/200',     title: 'Dungeon Floor',     tag: 'interior' },
  { id: 5,  src: 'https://picsum.photos/seed/mosscave/160/160',     title: 'Moss Cave',         tag: 'nature' },
  { id: 6,  src: 'https://picsum.photos/seed/sunsetpx/160/280',     title: 'Sunset Pixels',     tag: 'landscape' },
  { id: 7,  src: 'https://picsum.photos/seed/cozyroom/160/130',     title: 'Cozy Room',         tag: 'interior' },
  { id: 8,  src: 'https://picsum.photos/seed/glitchfx/160/190',     title: 'Glitch FX',         tag: 'abstract' },
  { id: 9,  src: 'https://picsum.photos/seed/forestpx/160/220',     title: 'Forest Path',       tag: 'nature' },
  { id: 10, src: 'https://picsum.photos/seed/cybercty/160/160',     title: 'Cyber City',        tag: 'landscape' },
  { id: 11, src: 'https://picsum.photos/seed/witchhat/160/180',     title: 'Witch Hat',         tag: 'character' },
  { id: 12, src: 'https://picsum.photos/seed/starpx99/160/140',     title: 'Starfield',         tag: 'sky' },
  { id: 13, src: 'https://picsum.photos/seed/lavaflow/160/200',     title: 'Lava Flow',         tag: 'abstract' },
  { id: 14, src: 'https://picsum.photos/seed/tinycafe/160/160',     title: 'Tiny Café',         tag: 'interior' },
  { id: 15, src: 'https://picsum.photos/seed/islandpx/160/240',     title: 'Pixel Island',      tag: 'landscape' },
  { id: 16, src: 'https://picsum.photos/seed/ghostpx1/160/120',     title: 'Ghost Sprite',      tag: 'character' },
  { id: 17, src: 'https://picsum.photos/seed/rainyday/160/180',     title: 'Rainy Day',         tag: 'sky' },
  { id: 18, src: 'https://picsum.photos/seed/crystalx/160/160',     title: 'Crystal Cave',      tag: 'nature' },
  { id: 19, src: 'https://picsum.photos/seed/spacepx9/160/220',     title: 'Deep Space',        tag: 'sky' },
  { id: 20, src: 'https://picsum.photos/seed/cottgpx1/160/150',     title: 'Pixel Cottage',     tag: 'landscape' },
];

const ALL_TAGS = ['all', ...new Set(GALLERY_ITEMS.map(i => i.tag))];

// Mod 6: React Components — Gallery functional component
const Gallery = () => {
  // Mod 7: React State — active filter tag
  const [activeTag, setActiveTag] = useState('all');
  // Mod 7: React State — lightbox selected image
  const [lightbox, setLightbox] = useState(null);

  // Mod 7: React State — filtered list derived from state
  const filtered = activeTag === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.tag === activeTag);

  return (
    <WindowContainer title="Inspo_Gallery.exe">

      {/* Filter bar — Mod 3: CSS Flexbox */}
      <div className="gallery-filter-bar border-inset">
        <span className="gallery-filter-label">🗂 FILTER:</span>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`border-outset gallery-filter-btn ${activeTag === tag ? 'border-inset gallery-filter-active' : ''}`}
          >
            {tag.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Masonry Grid — Mod 3: CSS column-count, no external library */}
      <div className="gallery-masonry">
        {filtered.map(item => (
          <div
            key={item.id}
            className="gallery-card border-window"
            onClick={() => setLightbox(item)}
            title={item.title}
          >
            <img
              src={item.src}
              alt={item.title}
              className="gallery-img"
              loading="lazy"
            />
            <div className="gallery-card-label">{item.title}</div>
          </div>
        ))}
      </div>

      {/* Lightbox — Mod 7: React State — conditional render */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <div className="gallery-lightbox-inner border-window" onClick={e => e.stopPropagation()}>
            <div className="title-bar">
              <span>{lightbox.title}</span>
              <div className="title-bar-buttons">
                <button className="border-outset window-btn" onClick={() => setLightbox(null)}>X</button>
              </div>
            </div>
            <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#c0c0c0' }}>
              <img
                src={lightbox.src.replace(/\/\d+\/\d+$/, '/320/320')}
                alt={lightbox.title}
                style={{ imageRendering: 'pixelated', maxWidth: '100%', display: 'block', margin: '0 auto' }}
              />
              <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: '0.8rem', color: '#000080' }}>
                🏷 TAG: {lightbox.tag.toUpperCase()}
              </div>
              <button
                className="border-outset pixel-btn"
                style={{ marginTop: 8 }}
                onClick={() => setLightbox(null)}
              >
                ✖ CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </WindowContainer>
  );
};

export default Gallery;
