import createGlobe from 'cobe';

const LOCATIONS = [
  { name: 'Principal', lat: 21.1578, lng: -100.9329, href: 'https://maps.app.goo.gl/DYWCD5bC3nW8DMmeA' },
  { name: 'Paseo Dolores', lat: 21.1643, lng: -100.9275, href: 'https://maps.google.com/?q=21.1643,-100.9275' },
];

function initGlobe() {
  const canvas    = document.getElementById('globe-canvas');
  const container = document.getElementById('globe-container');
  if (!canvas || !container) return;

  let globe  = null;
  let rafId  = null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let phi      = 3.39;
  let theta    = 0.37;
  let velX     = 0;
  let velY     = 0;
  let dragging = false;
  let lastX    = 0;
  let lastY    = 0;
  let activeIdx = -1;

  function buildMarkers() {
    return LOCATIONS.map((loc, i) => ({
      location: [loc.lat, loc.lng],
      size: i === activeIdx ? 0.10 : 0.07,
    }));
  }

  function createGlobeInstance(w, h) {
    if (globe) return;

    globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width:  w,
      height: h,
      phi,
      theta,
      dark:            1,
      diffuse:         1.4,
      mapSamples:      16000,
      mapBrightness:   6,
      mapBaseBrightness: 0,
      baseColor:      [0.09, 0.17, 0.30],
      markerColor:    [0.38, 0.50, 0.68],
      glowColor:      [0.38, 0.50, 0.68],
      markers:        buildMarkers(),
    });

    function tick() {
      if (!dragging) {
        velX *= 0.88;
        velY *= 0.88;
        phi  += velX;
        theta = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, theta + velY));
      }
      globe.update({ phi, theta });
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    canvas.addEventListener('mousedown', (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = velY = 0;
      canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      velX  = (e.clientX - lastX) * 0.006;
      velY  = -(e.clientY - lastY) * 0.006;
      phi  += velX;
      theta = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, theta + velY));
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
      canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('touchstart', (e) => {
      dragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      velX = velY = 0;
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      velX  = (e.touches[0].clientX - lastX) * 0.006;
      velY  = -(e.touches[0].clientY - lastY) * 0.006;
      phi  += velX;
      theta = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, theta + velY));
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });

    document.querySelectorAll('.location-item').forEach((item, i) => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('active');
        activeIdx = i;
        globe.update({ markers: buildMarkers() });
      });
      item.addEventListener('mouseleave', () => {
        item.classList.remove('active');
        activeIdx = -1;
        globe.update({ markers: buildMarkers() });
      });
    });
  }

  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w === 0 || h === 0) continue;
      if (!globe) {
        createGlobeInstance(w, h);
      } else {
        globe.update({ width: w, height: h });
      }
      break;
    }
  });
  ro.observe(container);

  const w0 = container.clientWidth;
  const h0 = container.clientHeight;
  if (w0 > 0 && h0 > 0) {
    createGlobeInstance(w0, h0);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
}
