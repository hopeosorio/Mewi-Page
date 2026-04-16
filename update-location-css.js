const fs = require('fs');
const f = 'C:\\Users\\noemi\\OneDrive\\Escritorio\\Landing page\\styles\\main.css';
let c = fs.readFileSync(f, 'utf8');

// Remove old location styles
let oldStart = c.indexOf('/* ===================================\n   Location Section - 3D Globe');
if (oldStart === -1) oldStart = c.indexOf('.location {');
let oldEnd = c.indexOf('.footer {');
if (oldEnd === -1) oldEnd = c.length;

// Find where location styles start (might have the old map styles too)
let searchStart = c.lastIndexOf('/* ===================================', oldStart);
if (searchStart === -1) searchStart = 0;

// Check if there's old location content
let oldLocSection = c.substring(searchStart, oldEnd);
let locationIdx = oldLocSection.indexOf('.location');
if (locationIdx > 0) {
  searchStart = searchStart + locationIdx - 200;
  if (searchStart < 0) searchStart = 0;
}

const before = c.substring(0, searchStart);
const after = c.substring(oldEnd);

const css = `
/* ===================================
   Location Section - Full Width Globe
   =================================== */
.location {
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.location-full {
  position: relative;
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

.location-header-overlay {
  position: absolute;
  top: 40px;
  left: 60px;
  z-index: 10;
  pointer-events: none;
}

.location-header-overlay .section-label {
  margin-bottom: 16px;
}

.location-header-overlay .section-title {
  margin-bottom: 12px;
}

.location-header-overlay .section-subtitle {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  max-width: 400px;
}

.globe-full-container {
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 500px;
  background: radial-gradient(ellipse at 50% 50%, #1a2a3a 0%, #0a1520 100%);
  overflow: hidden;
}

#globe-canvas {
  width: 100%;
  height: 100%;
  cursor: grab;
}

#globe-canvas:active {
  cursor: grabbing;
}

.globe-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  color: white;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease, transform 150ms ease;
  z-index: 20;
  border: 1px solid rgba(255,255,255,0.15);
  transform: translateY(5px);
  min-width: 200px;
}

.globe-tooltip.visible {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 6px;
}

.tooltip-address {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 8px;
}

.tooltip-hint {
  font-size: 0.75rem;
  color: var(--color-accent-1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.tooltip-hint::before {
  content: '';
  width: 12px;
  height: 12px;
  background: var(--color-accent-1);
  border-radius: 50%;
  display: inline-block;
}

.location-sidebar {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 15;
  max-width: 380px;
  max-height: 70vh;
  overflow-y: auto;
}

.location-sidebar::-webkit-scrollbar {
  width: 4px;
}

.location-sidebar::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
  border-radius: 100px;
}

.location-sidebar::-webkit-scrollbar-thumb {
  background: var(--color-accent-1);
  border-radius: 100px;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255,255,255,0.1);
}

.location-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  transition: all 200ms ease;
  cursor: pointer;
  text-decoration: none;
  color: white;
}

.location-item:hover {
  background: rgba(97, 128, 174, 0.2);
  border-color: var(--color-accent-1);
  transform: translateX(-4px);
}

.location-item.active {
  background: rgba(97, 128, 174, 0.3);
  border-color: var(--color-accent-1);
}

.location-dot {
  width: 10px;
  height: 10px;
  background: var(--gradient-primary);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
  position: relative;
}

.location-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid var(--color-accent-1);
  opacity: 0.4;
  animation: pingDot 2s ease-in-out infinite;
}

@keyframes pingDot {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.4); opacity: 0; }
}

.location-details-item h4 {
  font-weight: 600;
  font-size: 0.9375rem;
  margin-bottom: 4px;
  color: white;
}

.location-details-item p {
  font-size: 0.8125rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 6px;
}

.location-hours {
  font-size: 0.75rem;
  color: var(--color-success);
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-hours::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-success);
  border-radius: 50%;
}

@media (max-width: 768px) {
  .location-header-overlay {
    top: 20px;
    left: 24px;
    right: 24px;
  }
  
  .location-sidebar {
    position: relative;
    bottom: auto;
    right: auto;
    max-width: 100%;
    max-height: none;
  }
  
  .location-list {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .globe-full-container {
    height: 50vh;
    min-height: 300px;
  }
  
  .tooltip-hint {
    display: none;
  }
}

`;

fs.writeFileSync(f, before + css + after, 'utf8');
console.log('done');
