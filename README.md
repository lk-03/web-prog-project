# Mossaico – Retro Pixel Art Studio

Mossaico combines a pixel art drawing tool, an inspiration gallery, a YouTube tutorial viewer, and a drag-and-drop sticker board — all wrapped in a faithful Windows 95 desktop aesthetic.

## Features

### 🎨 Pixel Art Canvas
- 32×32 pixel drawing grid
- Tools: Pen, Eraser, Flood Fill (BFS), Line (Bresenham's algorithm)
- 16-color preset palette + custom color picker
- Adjustable brush size (1–4px)
- Export drawing as PNG download
- Save drawing as a custom sticker to the Sticker Board

### 📌 Sticker Board
- Drag-and-drop stickers freely on a freeform canvas
- 16 preset sticker images included
- Loads custom stickers saved from the Pixel Art Canvas
- Double-click a placed sticker to remove it

### 🖼 Inspiration Gallery
- 20 images in a CSS masonry grid layout (no external library)
- Filter by tag: landscape, character, sky, interior, nature, abstract
- Lightbox modal on image click

### 📺 Tutorials
- Curated YouTube playlist of 7 pixel art tutorial videos
- Scrollable sidebar playlist with thumbnails and durations
- Active video highlighted, auto-switches iframe on selection

### 👤 About & Home
- Static pages styled as retro OS windows

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React 19 |
| Build Tool | Vite 8 |
| Styling | Plain CSS (no UI library) |
| Routing | `useState`-based (no React Router) |
| Persistence | `localStorage` (custom stickers) |
| External Data | YouTube iframes, picsum.photos |

No third-party UI libraries, CSS frameworks, or state management libraries are used. All layouts, animations, and interactive patterns are implemented from scratch.

## Project Structure

```
mossaico/
├── public/
│   ├── stickers/                 # 16 preset sticker images
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── WindowContainer.jsx   # Reusable Win95 window chrome
│   │   ├── PixelArtStudio.jsx    # Drawing tool
│   │   ├── Gallery.jsx           # Masonry gallery + lightbox
│   │   └── Tutorials.jsx         # YouTube playlist viewer
│   ├── App.jsx                   # Root component, routing, StickerBoard
│   ├── App.css                   # Full Win95 design system
│   ├── index.css                 # Base resets + CSS variables
│   └── main.jsx                  # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

Clone the repository
```bash
git clone https://github.com/lk-03/web-prog-project.git
cd web-prog-project
```
Install dependencies
```bash
npm install
```
Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```
