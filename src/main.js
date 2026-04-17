import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Observer } from 'gsap/Observer';
import Lenis from 'lenis';

import { renderFavoritos } from './components/Favoritos.js';
import { renderTestimonios } from './components/Testimonios.js';

import { initNav, initMagneticButtons } from './js/nav.js';
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
import './js/map.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

// ===================================
// Lenis Smooth Scroll
// ===================================
window.lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

window.lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => window.lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Scrollbar + Nav run outside DOMContentLoaded (ES modules are deferred — DOM is already parsed)
initScrollbar();
initNav();

// ===================================
// Init All
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritos();
  renderTestimonios();

  document.fonts.ready.then(() => {
    initMagneticButtons();
    initHeroAnimations();
    initFavoritosCarousel();
    initProcesoAnimations();
    initValoresAnimations();
    initTestimoniosBento();
    initStatsAnimations();
    initAboutAnimations();
    initManifiestoAnimations();
    initEquipoAnimations();
    initLocationAnimations();
    initOpenStatus();
    initLiveFeed();
    initFooterPearls();
    initComunidadAnimations();

    gsap.from('.social-card', {
      scrollTrigger: { trigger: '.social-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 60, duration: 0.8, stagger: 0.15, ease: 'power3.out'
    });

    gsap.from('.cta-content', {
      scrollTrigger: { trigger: '.final-cta', start: 'top 75%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 80, scale: 0.95, duration: 1.2, ease: 'power3.out'
    });

    initGlobalParallax();

    setTimeout(() => ScrollTrigger.refresh(), 100);
  });
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});
