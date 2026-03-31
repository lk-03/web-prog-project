// Mod 6: React Components — Reusable Higher Order Component
// Mod 4: HTML — semantic structure for Win95 window chrome
import React from 'react';

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

export default WindowContainer;
