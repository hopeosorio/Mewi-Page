import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Observer } from 'gsap/Observer';
import Lenis from 'lenis';

import { renderFavoritos } from './components/Favoritos.js';
import { renderTestimonios } from './components/Testimonios.js';

import { initNav, initMagneticButtons } from './js/nav.js';
import { initTheme } from './js/theme.js';
import { initScrollbar } from './js/scrollbar.js';
import { initHeroAnimations } from './js/hero.js';
import { initFavoritosCarousel } from './js/favoritos.js';
import { initProcesoAnimations } from './js/proceso.js';
import { initValoresAnimations } from './js/valores.js';
import { initAboutAnimations } from './js/about.js';
import { initManifiestoAnimations } from './js/manifiesto.js';
import { initEquipoAnimations } from './js/equipo.js';
import { initTestimoniosBento, initStatsAnimations } from './js/testimonios.js';
import { initComunidadAnimations } from './js/comunidad.js';
import { initLocationAnimations, initOpenStatus, initLiveFeed } from './js/location.js';
import { initFooterPearls } from './js/footer.js';
import { initGlobalParallax } from './js/parallax.js';
// map.js loaded lazily when section enters viewport
const mapContainer = document.getElementById('map-container');
if (mapContainer) {
  const mapObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      import('./js/map.js');
      mapObserver.disconnect();
    }
  }, { rootMargin: '200px' });
  mapObserver.observe(mapContainer);
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

// ===================================
// Lenis Smooth Scroll
// ===================================
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  window.lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => window.lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
} else {
  window.lenis = null;
  window.addEventListener('scroll', ScrollTrigger.update, { passive: true });

  // Touch: dejar el scroll NATIVO (fluido, en hilo de compositor). No usar
  // normalizeScroll: su listener no-passive fuerza el scroll al hilo principal
  // = trabado en iOS/iPad. El address bar (resize al cambiar dirección) ya se
  // neutraliza con ignoreMobileResize, sin sacrificar fluidez.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// Scrollbar + Nav run outside DOMContentLoaded (ES modules are deferred — DOM is already parsed)
initScrollbar();
initNav();
initTheme();

// ===================================
// Init All
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritos();
  renderTestimonios();

  // Init immediately — visible on first paint
  initHeroAnimations();
  initOpenStatus();
  initLiveFeed();
  if (!isTouchDevice) requestAnimationFrame(() => initMagneticButtons());
  requestAnimationFrame(() => requestAnimationFrame(initGlobalParallax));

  // Lazy-init sections as they approach viewport.
  // Observers are set up immediately (no fonts gate) so ScrollTriggers exist
  // before the user starts scrolling — prevents mid-scroll GSAP batch refresh
  // that caused scroll freezes on mobile.
  function lazyInit(selector, fn) {
    const el = document.querySelector(selector);
    if (!el) { fn(); return; }
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { obs.disconnect(); fn(); }
    }, { rootMargin: '400px 0px' });
    obs.observe(el);
  }

  lazyInit('.favoritos', initFavoritosCarousel);
  lazyInit('.proceso', initProcesoAnimations);
  lazyInit('.valores', initValoresAnimations);
  lazyInit('.about', initAboutAnimations);
  lazyInit('.manifiesto', initManifiestoAnimations);
  lazyInit('.equipo', initEquipoAnimations);
  lazyInit('.testimonios', () => { initTestimoniosBento(); initStatsAnimations(); });
  lazyInit('.comunidad', initComunidadAnimations);
  lazyInit('.location', initLocationAnimations);
  lazyInit('.footer', initFooterPearls);
  lazyInit('.social-proof', () => {
    gsap.from('.s-card', {
      scrollTrigger: { trigger: '.social-cards', start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 60, duration: 0.8, stagger: 0.15, ease: 'power3.out'
    });
  });
  lazyInit('.final-cta', () => {
    gsap.from('.cta-content', {
      scrollTrigger: { trigger: '.final-cta', start: 'top 75%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 80, scale: 0.95, duration: 1.2, ease: 'power3.out'
    });
  });

  // After fonts load, refresh ScrollTrigger measurements (corrects layout-dependent positions)
  document.fonts.ready.then(() => {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });
});

let resizeTimer;
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  // iOS: la barra de Safari colapsa/expande al invertir scroll → dispara resize (solo
  // cambia ALTO). Refrescar ScrollTrigger ahí recalcula todos los triggers/pins/scrub
  // a mitad de scroll = el "salto". En touch, refrescar SOLO si cambia el ANCHO
  // (rotación/resize real); ignorar los cambios de solo-alto de la barra.
  if (isTouchDevice && window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});
