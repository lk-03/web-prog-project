// Mod 7: React State — useState for active video selection
// Mod 3: CSS Properties — Flexbox layout, 16:9 aspect ratio
import React, { useState } from 'react';
import WindowContainer from './WindowContainer';

// Mod 7: React State — static data array, source of truth for playlist
const PLAYLIST = [
  {
    id: 'lfR7Qj04-UA',
    title: 'Pixel Art for Beginners — Getting Started',
    duration: '12:34',
    thumb: `https://img.youtube.com/vi/lfR7Qj04-UA/mqdefault.jpg`,
  },
  {
    id: 'tFsETEP01k8',
    title: 'Understanding Color Palettes in Pixel Art',
    duration: '18:22',
    thumb: `https://img.youtube.com/vi/tFsETEP01k8/mqdefault.jpg`,
  },
  {
    id: 'B0enS9BJne4',
    title: 'Shading & Lighting Techniques',
    duration: '21:05',
    thumb: `https://img.youtube.com/vi/B0enS9BJne4/mqdefault.jpg`,
  },
  {
    id: 'vXm5VjZA4Ys',
    title: 'Creating Pixel Art Characters',
    duration: '25:47',
    thumb: `https://img.youtube.com/vi/vXm5VjZA4Ys/mqdefault.jpg`,
  },
  {
    id: 'BgPYNyIJ4s8',
    title: 'Pixel Art Landscapes & Environments',
    duration: '30:10',
    thumb: `https://img.youtube.com/vi/BgPYNyIJ4s8/mqdefault.jpg`,
  },
  {
    id: 'cSoicq0WJqU',
    title: 'Animation Basics for Pixel Art',
    duration: '28:55',
    thumb: `https://img.youtube.com/vi/cSoicq0WJqU/mqdefault.jpg`,
  },
  {
    id: 'ZtTGGllR36o',
    title: 'Advanced Pixel Art — Dithering & Texture',
    duration: '35:20',
    thumb: `https://img.youtube.com/vi/ZtTGGllR36o/mqdefault.jpg`,
  },
];

// Mod 6: React Components — functional component
const Tutorials = () => {
  // Mod 7: React State — tracks which video is active
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = PLAYLIST[activeIndex];

  return (
    <WindowContainer title="Tutorials.chm">
      {/* Mod 3: CSS — YouTube-style flex layout */}
      <div className="tutorials-layout">

        {/* LEFT: Main video player */}
        <div className="tutorials-main">
          {/* Mod 3: CSS — 16:9 aspect ratio container */}
          <div className="video-container border-inset">
            {/* Mod 4: HTML — iframe embed, key forces remount on video change */}
            <iframe
              key={activeVideo.id}
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=0`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Now playing label */}
          <div className="tutorials-now-playing border-inset">
            <span className="tutorials-now-label">&gt; NOW PLAYING:</span>
            <span className="tutorials-now-title">{activeVideo.title}</span>
            <span className="tutorials-now-index">
              [{activeIndex + 1}/{PLAYLIST.length}]
            </span>
          </div>
        </div>

        {/* RIGHT: Scrollable playlist sidebar */}
        {/* Mod 4: HTML — semantic <aside> for supplementary content */}
        <aside className="tutorials-playlist border-inset">
          <div className="playlist-header border-outset">
            📼 PLAYLIST — {PLAYLIST.length} VIDEOS
          </div>

          <div className="playlist-scroll">
            {/* Mod 7: React State — map over array, highlight active */}
            {PLAYLIST.map((video, index) => (
              <div
                key={video.id}
                onClick={() => setActiveIndex(index)}
                className={`playlist-item border-outset ${activeIndex === index ? 'playlist-item-active border-inset' : ''}`}
              >
                {/* Thumbnail */}
                <div className="playlist-thumb">
                  <img
                    src={video.thumb}
                    alt={video.title}
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  {activeIndex === index && (
                    <div className="playlist-playing-badge">▶</div>
                  )}
                </div>

                {/* Info */}
                <div className="playlist-info">
                  <div className="playlist-index">#{index + 1}</div>
                  <div className="playlist-title">{video.title}</div>
                  <div className="playlist-duration">⏱ {video.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </WindowContainer>
  );
};

export default Tutorials;
