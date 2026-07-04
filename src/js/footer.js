export function initFooterPearls() {
  const container = document.getElementById('footer-pearls');
  if (!container) return;

  const isMobile = window.innerWidth < 768;

  // Reparte trabajo pesado en chunks por frame para no bloquear un frame de
  // scroll. La init dispara a 400px del footer (rootMargin), así que construir
  // en ~varios frames en vez de un task largo es invisible pero evita el freeze.
  function drainChunks(thunks, perFrame, onDone) {
    let i = 0;
    requestAnimationFrame(function step() {
      const end = Math.min(i + perFrame, thunks.length);
      while (i < end) thunks[i++]();
      if (i < thunks.length) requestAnimationFrame(step);
      else if (onDone) onDone();
    });
  }

  // ---- Canvas de fondo: perlas de gradiente difuminadas (z-index 2) ----
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const bgLayers = [
    { count: isMobile ? 60 : 150, bottomRange: [80, 250], sizeMin: 15, sizeMax: 35, opacity: 0.35, blur: 3 },
    { count: isMobile ? 40 : 100, bottomRange: [150, 350], sizeMin: 10, sizeMax: 25, opacity: 0.2, blur: 6 },
    { count: isMobile ? 25 : 70, bottomRange: [200, 400], sizeMin: 5, sizeMax: 15, opacity: 0.12, blur: 8 },
    { count: isMobile ? 20 : 55, bottomRange: [300, 450], sizeMin: 3, sizeMax: 10, opacity: 0.08, blur: 1 },
  ];

  function drawBgPearl(layer) {
    const size = Math.random() * (layer.sizeMax - layer.sizeMin) + layer.sizeMin;
    const x = Math.random() * (canvas.width + size * 2) - size;
    const bottomPx = Math.random() * (layer.bottomRange[1] - layer.bottomRange[0]) + layer.bottomRange[0];
    const y = canvas.height - bottomPx;
    const opacity = layer.opacity - Math.random() * 0.05;
    const brightness = 0.5 + Math.random() * 0.5;

    ctx.save();
    if (layer.blur > 0) ctx.filter = `blur(${layer.blur}px)`;
    ctx.globalAlpha = opacity;
    const grad = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, size * 0.05, x, y, size * 0.5);
    const hi = Math.round(40 + brightness * 40);
    const mid = Math.round(15 + brightness * 20);
    const dark = Math.round(5 + brightness * 10);
    grad.addColorStop(0,   `rgb(${hi + 20}, ${hi + 12}, ${hi})`);
    grad.addColorStop(0.4, `rgb(${mid + 15}, ${mid + 8}, ${mid})`);
    grad.addColorStop(1,   `rgb(${dark}, ${dark - 3}, ${dark - 5})`);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function drawCanvasPearls() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const thunks = [];
    bgLayers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) thunks.push(() => drawBgPearl(layer));
    });
    drainChunks(thunks, isMobile ? 20 : 40);
  }

  // ---- Canvas de perlas estáticas: mismas esferas webp (z-index 50) ----
  // Antes eran 450 divs DOM (paint/capas pesadas); ahora se dibujan en canvas.
  const staticCanvas = document.createElement('canvas');
  staticCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:50;';
  container.appendChild(staticCanvas);
  const staticCtx = staticCanvas.getContext('2d');

  const staticLayer = { count: isMobile ? 130 : 450, bottomRange: [-60, 30], sizeMin: 40, sizeMax: 65, opacity: 1 };
  const staticPearls = [];
  for (let i = 0; i < staticLayer.count; i++) {
    staticPearls.push({
      size: Math.random() * (staticLayer.sizeMax - staticLayer.sizeMin) + staticLayer.sizeMin,
      left: Math.random() * 115 - 7.5,
      bottom: Math.random() * (staticLayer.bottomRange[1] - staticLayer.bottomRange[0]) + staticLayer.bottomRange[0],
      opacity: staticLayer.opacity - Math.random() * 0.2,
      brightness: 0.5 + Math.random() * 0.6,
    });
  }

  const pearlImg = new Image();
  function drawStaticPearls() {
    if (!pearlImg.complete || !pearlImg.naturalWidth) return;
    staticCanvas.width = container.offsetWidth;
    staticCanvas.height = container.offsetHeight;
    staticCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
    drainChunks(staticPearls.map(p => () => {
      staticCtx.save();
      staticCtx.globalAlpha = p.opacity;
      staticCtx.filter = `brightness(${p.brightness})`;
      staticCtx.drawImage(pearlImg, (p.left / 100) * staticCanvas.width, staticCanvas.height - p.bottom - p.size, p.size, p.size);
      staticCtx.restore();
    }), isMobile ? 40 : 80);
  }
  pearlImg.onload = drawStaticPearls;
  pearlImg.src = '/brand/Esfera5.webp';

  drawCanvasPearls();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { drawCanvasPearls(); drawStaticPearls(); }, 200);
  });

  // ---- Perlas animadas (DOM, con animación CSS de flotado) ----
  const domLayers = [
    { count: isMobile ? 35 : 70, bottomRange: [10, 80], sizeMin: 35, sizeMax: 55, opacity: 0.9, speedMult: 0.8, z: 49 },
    { count: isMobile ? 25 : 55, bottomRange: [30, 150], sizeMin: 30, sizeMax: 48, opacity: 0.8, speedMult: 1.2, z: 48 },
  ];

  const fragment = document.createDocumentFragment();
  function buildPearl(layer) {
    const pearl = document.createElement('div');
    pearl.className = 'footer-pearl';

    const size = Math.random() * (layer.sizeMax - layer.sizeMin) + layer.sizeMin;
    const left = Math.random() * 115 - 7.5;
    const bottom = Math.random() * (layer.bottomRange[1] - layer.bottomRange[0]) + layer.bottomRange[0];
    const brightness = 0.5 + Math.random() * 0.6;

    Object.assign(pearl.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      bottom: `${bottom}px`,
      opacity: layer.opacity - Math.random() * 0.2,
      zIndex: layer.z,
    });

    if (brightness !== 1) pearl.style.filter = `brightness(${brightness})`;
    pearl.style.animationDuration = `${(12 + Math.random() * 10) / (layer.speedMult || 1)}s`;
    pearl.style.animationDelay = `${Math.random() * -20}s`;

    fragment.appendChild(pearl);
  }

  const pearlThunks = [];
  domLayers.forEach(layer => {
    for (let i = 0; i < layer.count; i++) pearlThunks.push(() => buildPearl(layer));
  });

  drainChunks(pearlThunks, isMobile ? 40 : 80, () => {
    container.appendChild(fragment);

    const pearls = container.querySelectorAll('.footer-pearl');
    const observer = new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      pearls.forEach(p => { p.style.animationPlayState = visible ? 'running' : 'paused'; });
    }, { threshold: 0 });
    observer.observe(container);

    ['/images/productos/mewi-1.webp', '/images/productos/mewi-12.webp'].forEach((src, i) => {
      const prod = document.createElement('img');
      prod.src = src;
      prod.className = 'footer-product-float';
      prod.loading = 'lazy';
      const size = isMobile ? 240 : 380;

      const leftPositions = isMobile ? [-8, 54] : [5, 72];
      const bottomBase = isMobile ? 20 : -35;
      Object.assign(prod.style, {
        width: `${size}px`,
        left: `${leftPositions[i]}%`,
        bottom: `${bottomBase + Math.random() * 20}px`,
        zIndex: 30,
        animationDuration: `${12 + Math.random() * 6}s`,
        animationDelay: `${Math.random() * -15}s`,
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
      });
      container.appendChild(prod);
    });
  });
}
