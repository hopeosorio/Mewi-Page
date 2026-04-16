const fs = require('fs');
const f = 'C:\\Users\\noemi\\OneDrive\\Escritorio\\Landing page\\styles\\main.css';
let c = fs.readFileSync(f, 'utf8');

const css = `
/* ===================================
   Location Section - 3D Globe
   =================================== */
.location {
  padding: 160px 0;
  border-top: 1px solid var(--color-border);
}

.location-header {
  text-align: center;
  margin-bottom: 80px;
}

.globe-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: start;
}

.globe-container {
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: radial-gradient(circle at 30% 30%, #1a2a3a 0%, #0a1520 100%);
  border: 1px solid var(--color-border);
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
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  color: white;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
  z-index: 10;
  border: 1px solid rgba(255,255,255,0.1);
}

.globe-tooltip.visible {
  opacity: 1;
}

.tooltip-name {
  font-weight: 700;
  font-size: 0.9375rem;
  margin-bottom: 4px;
}

.tooltip-address {
  font-size: 0.8125rem;
  color: rgba(255,255,255,0.7);
}

.globe-locations {
  padding: 24px 0;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.location-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all 150ms ease;
  cursor: pointer;
}

.location-item:hover {
  border-color: var(--color-accent-1);
  background: var(--gradient-soft);
  transform: translateX(4px);
}

.location-dot {
  width: 12px;
  height: 12px;
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
  opacity: 0.3;
  animation: pingDot 2s ease-in-out infinite;
}

@keyframes pingDot {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.3); opacity: 0; }
}

.location-details-item h4 {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
}

.location-details-item p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.location-hours {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
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

@media (max-width: 1024px) {
  .globe-layout {
    grid-template-columns: 1fr;
  }
  .globe-container {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .globe-container {
    height: 350px;
  }
  .location-item {
    padding: 16px;
  }
}

`;

let insertPoint = c.indexOf('.footer {');
if (insertPoint === -1) insertPoint = c.length;
fs.writeFileSync(f, c.substring(0, insertPoint) + css + c.substring(insertPoint), 'utf8');
console.log('done');
