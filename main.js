import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import './globe.js';
import './map.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===================================
// Lenis Smooth Scroll
// ===================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ===================================
// Custom Scrollbar
// ===================================
const scrollbarThumb = document.getElementById('custom-scrollbar-thumb');
let currentScroll = 0;
let currentLimit = 0;

function setThumbSize(limit) {
  const viewportH = window.innerHeight;
  const thumbH = Math.max((viewportH / (limit + viewportH)) * viewportH, 40);
  scrollbarThumb.style.height = `${thumbH}px`;
  return thumbH;
}

lenis.on('scroll', (l) => {
  const scroll = l.scroll;
  const limit = l.limit;
  if (limit <= 0) return;

  currentScroll = scroll;
  currentLimit = limit;

  const viewportH = window.innerHeight;
  const thumbH = setThumbSize(limit);
  const maxTop = viewportH - thumbH;
  scrollbarThumb.style.top = `${(scroll / limit) * maxTop}px`;
});

window.addEventListener('resize', () => {
  if (currentLimit > 0) setThumbSize(currentLimit);
});

// Drag to scroll
let dragging = false;
let dragStartY = 0;
let dragStartScroll = 0;

scrollbarThumb.addEventListener('mousedown', (e) => {
  dragging = true;
  dragStartY = e.clientY;
  dragStartScroll = currentScroll;
  scrollbarThumb.classList.add('dragging');
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const viewportH = window.innerHeight;
  const thumbH = parseFloat(scrollbarThumb.style.height) || 40;
  const maxTop = viewportH - thumbH;
  const delta = ((e.clientY - dragStartY) / maxTop) * currentLimit;
  lenis.scrollTo(dragStartScroll + delta, { duration: 0 });
});

document.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  scrollbarThumb.classList.remove('dragging');
  document.body.style.userSelect = '';
});

// ===================================
// Nav Scroll
// ===================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 100);
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -100 });
  });
});

// ===================================
// Magnetic Buttons
// ===================================
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    gsap.to(btn, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
  });
});

// ===================================
// Hero Animations
// ===================================
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });
  
  tl.to('.line-inner', {
    y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out'
  })
  .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  .from('.hero-actions', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  .from('.scroll-indicator', { opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
  
  gsap.to('.hero-content', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: 150, opacity: 0
  });
  
  gsap.to('.orb-1', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    x: 200, y: -100
  });
  gsap.to('.orb-2', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    x: -200, y: 100
  });
}

// ===================================
// Favoritos Carousel
// ===================================
function initFavoritosAnimations() {
  const carousel = document.querySelector('.favoritos-carousel');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (carousel) {
    const scrollAmount = 424; // 400px + 24px gap

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }
  }

  // Animate slides
  document.querySelectorAll('.favorito-slide').forEach((slide, i) => {
    gsap.from(slide, {
      scrollTrigger: {
        trigger: '.favoritos',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });
}

// ===================================
// Proceso Animations
// ===================================
function initProcesoAnimations() {
  gsap.from('.proceso .section-header', {
    scrollTrigger: { trigger: '.proceso .section-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 60, duration: 1, ease: 'power3.out'
  });

  document.querySelectorAll('.proceso-row').forEach((row) => {
    const isReverse = row.classList.contains('proceso-row--reverse');
    const num = row.querySelector('.proceso-row-num');
    const content = row.querySelector('.proceso-row-content');
    const st = { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' };

    if (num) {
      gsap.from(num, {
        scrollTrigger: st,
        opacity: 0,
        x: isReverse ? 80 : -80,
        duration: 1.4,
        ease: 'power4.out',
      });
    }
    if (content) {
      gsap.from(content, {
        scrollTrigger: st,
        opacity: 0,
        x: isReverse ? -50 : 50,
        duration: 0.9,
        delay: 0.1,
        ease: 'power3.out',
      });
    }
  });
}

// ===================================
// Valores Animations
// ===================================
function initValoresAnimations() {
  gsap.from('.valores-header', {
    scrollTrigger: { trigger: '.valores-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'
  });

  gsap.from('.valor-card--featured', {
    scrollTrigger: { trigger: '.valores-bento', start: 'top 82%', toggleActions: 'play none none reverse' },
    opacity: 0, x: -60, duration: 1.1, ease: 'power3.out',
  });

  gsap.from('.valor-card:not(.valor-card--featured)', {
    scrollTrigger: { trigger: '.valores-bento', start: 'top 82%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 40, duration: 0.7, stagger: 0.1, delay: 0.2, ease: 'power3.out',
  });
}

// ===================================
// Testimonios Marquee
// ===================================
function initTestimoniosAnimations() {
  const marqueeContent = document.querySelector('.testimonios-marquee .marquee-track');
  if (marqueeContent) {
    gsap.to(marqueeContent, {
      x: '-50%',
      duration: 40,
      ease: 'none',
      repeat: -1
    });
  }
}

// ===================================
// Stats Counter
// ===================================
function initStatsAnimations() {
  document.querySelectorAll('.stats .stat-num').forEach(stat => {
    const target = parseFloat(stat.dataset.count);
    const isDecimal = target % 1 !== 0;
    
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(stat, {
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            const current = target * this.progress();
            stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
          }
        });
      },
      once: true
    });
  });
}

// ===================================
// About Animations
// ===================================
function initAboutAnimations() {
  gsap.to('.bg-word', {
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: -200
  });
  
  gsap.from('.about-left', {
    scrollTrigger: { trigger: '.about-content', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 0, x: -60, duration: 1, ease: 'power3.out'
  });
  
  gsap.from('.about-right', {
    scrollTrigger: { trigger: '.about-content', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 0, x: 60, duration: 1, delay: 0.2, ease: 'power3.out'
  });
  
  document.querySelectorAll('.highlight-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0, x: -20, duration: 0.6, delay: i * 0.1, ease: 'power3.out'
    });
  });
}

// ===================================
// Manifiesto Animations
// ===================================
function initManifiestoAnimations() {
  // Set initial states
  gsap.set('.manifiesto-label', { opacity: 0, y: 40 });
  gsap.set('.manifiesto-line', { opacity: 0, y: 100, rotateX: -60 });
  gsap.set('.manifiesto-block', { opacity: 0, y: 80, scale: 0.9 });
  gsap.set('.manifiesto-bg', { y: 0 });

  // Background parallax
  gsap.to('.manifiesto-bg', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: 100, ease: 'none'
  });

  // Label slide up
  gsap.to('.manifiesto-label', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  });

  // Title lines reveal with rotation
  gsap.to('.manifiesto-line', {
    scrollTrigger: { trigger: '.manifiesto-title', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.2, ease: 'power4.out',
    transformOrigin: 'center bottom',
    force3D: true
  });

  // Manifiesto blocks
  gsap.to('.manifiesto-block', {
    scrollTrigger: { trigger: '.manifiesto-grid', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: 'power3.out'
  });
}

// ===================================
// Equipo Animations
// ===================================
function initEquipoAnimations() {
  // Set initial states
  gsap.set('.equipo-visual', { clipPath: 'inset(100% 0 0 0)' });
  gsap.set('.collage-piece', { opacity: 0, y: 80 });
  gsap.set('.equipo-info .section-label', { opacity: 0, y: 40 });
  gsap.set('.equipo-title', { opacity: 0, x: 80 });
  gsap.set('.equipo-text', { opacity: 0, y: 50 });
  gsap.set('.equipo-stat', { opacity: 0, y: 40, scale: 0.85 });
  gsap.set('.equipo-stat-sep', { scaleY: 0 });
  gsap.set('.equipo-value-item', { opacity: 0, x: -40 });

  // Visual panel slide in with clip reveal
  gsap.to('.equipo-visual', {
    scrollTrigger: { trigger: '.equipo', start: 'top 75%', toggleActions: 'play none none reverse' },
    clipPath: 'inset(0 0 0 0)', duration: 1.4, ease: 'power4.out'
  });

  // Collage pieces float in
  gsap.to('.collage-piece', {
    scrollTrigger: { trigger: '.equipo-collage', start: 'top 70%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, duration: 1, stagger: 0.15, delay: 0.3, ease: 'power3.out'
  });

  // Info panel text reveal
  gsap.to('.equipo-info .section-label', {
    scrollTrigger: { trigger: '.equipo-info', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  });

  gsap.to('.equipo-title', {
    scrollTrigger: { trigger: '.equipo-info', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, x: 0, duration: 1, delay: 0.15, ease: 'power3.out'
  });

  gsap.to('.equipo-text', {
    scrollTrigger: { trigger: '.equipo-info', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out'
  });

  // Stats counter animation
  document.querySelectorAll('.equipo-stat-num').forEach(stat => {
    const text = stat.textContent;
    const target = parseInt(text);
    const suffix = text.replace(/[0-9]/g, '');
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: function() {
            stat.textContent = Math.floor(this.targets()[0].val) + suffix;
          }
        });
      },
      once: true
    });
  });

  gsap.to('.equipo-stat', {
    scrollTrigger: { trigger: '.equipo-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, delay: 0.2, ease: 'back.out(1.7)'
  });

  gsap.to('.equipo-stat-sep', {
    scrollTrigger: { trigger: '.equipo-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
    scaleY: 1, duration: 0.6, stagger: 0.15, delay: 0.3, ease: 'power3.out'
  });

  // Value items slide in
  gsap.to('.equipo-value-item', {
    scrollTrigger: { trigger: '.equipo-values', start: 'top 85%', toggleActions: 'play none none reverse' },
    opacity: 1, x: 0, duration: 0.6, stagger: 0.12, delay: 0.4, ease: 'power3.out'
  });

  // Parallax on collage pieces
  gsap.to('.piece-1', {
    scrollTrigger: { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: -60, ease: 'none'
  });
  gsap.to('.piece-2', {
    scrollTrigger: { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: -90, ease: 'none'
  });
  gsap.to('.piece-3', {
    scrollTrigger: { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: -45, ease: 'none'
  });
}

// ===================================
// Location Animations + Live Feed
// ===================================
function initLocationAnimations() {
  const st = { trigger: '.location', start: 'top 75%', toggleActions: 'play none none reverse' };

  // Mapa entra con fade + leve escala
  gsap.from('.map-area', {
    scrollTrigger: st,
    opacity: 0, scale: 0.97, duration: 1.1, ease: 'power3.out'
  });

  // Panel desde la derecha
  gsap.from('.location-panel', {
    scrollTrigger: st,
    opacity: 0, x: 40, duration: 1, ease: 'power3.out', delay: 0.2
  });

  gsap.from('.panel-header, .panel-stats, .panel-feed-label, .location-item', {
    scrollTrigger: { trigger: '.location', start: 'top 72%', toggleActions: 'play none none reverse' },
    opacity: 0, x: 24, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.35
  });
}

// ===================================
// Open / Closed Status
// ===================================
function initOpenStatus() {
  const now = new Date();
  const mxHour = parseInt(
    new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      hour: 'numeric',
      hour12: false,
    }).format(now),
    10
  );

  const isOpen    = mxHour >= 10 && mxHour < 22;
  const hoursText = isOpen
    ? 'Abierto · 10:00 – 22:00'
    : 'Cerrado · Abre a las 10:00';

  const badge = document.querySelector('.panel-open-badge');
  if (badge) {
    badge.textContent = isOpen ? 'Abierto' : 'Cerrado';
    if (!isOpen) {
      badge.style.color       = '#dc2626';
      badge.style.background  = 'rgba(220,38,38,0.08)';
      badge.style.borderColor = 'rgba(220,38,38,0.2)';
    }
  }

  document.querySelectorAll('.location-hours').forEach(el => {
    el.textContent = hoursText;
    el.classList.toggle('closed', !isOpen);
  });
}

function initLiveFeed() {
  // Contador de visitas que sube lentamente
  const counter = document.getElementById('live-count');
  if (counter) {
    function tickCounter() {
      const current = parseInt(counter.textContent, 10);
      counter.textContent = current + Math.floor(Math.random() * 3 + 1);
      setTimeout(tickCounter, Math.random() * 5000 + 3000);
    }
    setTimeout(tickCounter, 4000);
  }

  // Cicla por los items simulando actividad en tiempo real
  const items = Array.from(document.querySelectorAll('.location-item'));
  if (!items.length) return;

  let idx = 0;
  function flashNext() {
    const item = items[idx % items.length];
    item.classList.add('live-flash');
    setTimeout(() => item.classList.remove('live-flash'), 1200);
    idx++;
    setTimeout(flashNext, Math.random() * 3500 + 2000);
  }
  setTimeout(flashNext, 2000);
}

// ===================================
// Social Animations
// ===================================
function initSocialAnimations() {
  gsap.from('.social-header', {
    scrollTrigger: { trigger: '.social-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 60, duration: 1, ease: 'power3.out'
  });
  
  document.querySelectorAll('.social-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 60, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
    });
  });
}

// ===================================
// CTA Animations
// ===================================
function initCTAAnimations() {
  gsap.from('.cta-content', {
    scrollTrigger: { trigger: '.final-cta', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 80, scale: 0.95, duration: 1.2, ease: 'power3.out'
  });
}

// ===================================
// Init All
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  document.fonts.ready.then(() => {
    initHeroAnimations();
    initFavoritosAnimations();
    initProcesoAnimations();
    initValoresAnimations();
    initTestimoniosAnimations();
    initStatsAnimations();
    initAboutAnimations();
    initManifiestoAnimations();
    initEquipoAnimations();
    initLocationAnimations();
    initOpenStatus();
    initLiveFeed();
    initSocialAnimations();
    initCTAAnimations();
    
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});
