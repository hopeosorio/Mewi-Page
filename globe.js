// ===================================
// Globe con cobe v2
// API real: createGlobe(canvas, opts) → { update, destroy }
// La animación se hace con requestAnimationFrame + globe.update()
// ===================================
import createGlobe from 'cobe';

const LOCATIONS = [
  { name: 'Centro Histórico',    lat: 21.1538, lng: -100.9328, href: 'https://maps.app.goo.gl/DYWCD5bC3nW8DMmeA' },
  { name: 'Plaza Paseo Dolores', lat: 21.1589, lng: -100.9257, href: 'https://maps.google.com/?q=21.1589,-100.9257' },
];

function initGlobe() {
  const canvas    = document.getElementById('globe-canvas');
  const container = document.getElementById('globe-container');
  if (!canvas || !container) return;

  let globe  = null;
  let rafId  = null;

  // cobe multiplica width/height por devicePixelRatio internamente;
  // solo pasamos el tamaño CSS real
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // phi ≈ 3.39 centra la longitud de Dolores Hidalgo, GTO (-100.93°)
  // theta ≈ 0.35 centra la latitud de Dolores Hidalgo (21.15°N)
  let phi      = 3.39;
  let theta    = 0.35;
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
      markerColor:    [0.27, 0.87, 0.50],
      glowColor:      [0.18, 0.42, 0.75],
      markers:        buildMarkers(),
    });

    // ---- Loop de animación ----
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

    // ---- Drag con ratón ----
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

    // ---- Drag táctil ----
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

    // ---- Hover sidebar → resalta marcador en globo ----
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
      item.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(item.href, '_blank');
      });
    });
  }

  // ---- Resize: actualiza tamaño y, si aún no hay globo, lo crea ----
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w === 0 || h === 0) continue;

      if (!globe) {
        // Primera vez con dimensiones reales: crear el globo
        createGlobeInstance(w, h);
      } else {
        // Resize posterior: actualizar dimensiones
        globe.update({ width: w, height: h });
      }
      break;
    }
  });
  ro.observe(container);

  // Fallback: si el ResizeObserver no dispara (ya tiene tamaño), iniciar manual
  const w0 = container.clientWidth;
  const h0 = container.clientHeight;
  if (w0 > 0 && h0 > 0) {
    createGlobeInstance(w0, h0);
  }
}

// ---- Init ----
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
}
