import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Observer } from 'gsap/Observer';
import Lenis from 'lenis';

// Components
import { renderFavoritos } from './components/Favoritos.js';
import { renderTestimonios } from './components/Testimonios.js';

// Init Mapa Leaflet
import './map.js';

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

// ===================================
// Custom Scrollbar
// ===================================
// Insertar al final del DOM — después de todo el setup de GSAP
// para que quede como último elemento en el compositor del browser
const scrollbarTrack = document.createElement('div');
scrollbarTrack.id = 'custom-scrollbar';
scrollbarTrack.setAttribute('aria-hidden', 'true');
scrollbarTrack.style.setProperty('cursor', "url('/cursor-default.svg') 1 1, auto", 'important');

const scrollbarThumb = document.createElement('div');
scrollbarThumb.id = 'custom-scrollbar-thumb';
scrollbarThumb.style.setProperty('cursor', "url('/cursor-grab.svg') 12 12, grab", 'important');

scrollbarTrack.appendChild(scrollbarThumb);
document.body.appendChild(scrollbarTrack);
let currentScroll = 0;
let currentLimit = 0;

function getNavOffset() {
  const navEl = document.getElementById('nav');
  return navEl ? navEl.getBoundingClientRect().height : 80;
}

function updateTrackBounds() {
  const offset = getNavOffset();
  scrollbarTrack.style.top = `${offset}px`;
}

function setThumbSize(limit) {
  const trackH = scrollbarTrack.getBoundingClientRect().height;
  const thumbH = Math.max((trackH / (limit + trackH)) * trackH, 40);
  scrollbarThumb.style.height = `${thumbH}px`;
  return thumbH;
}

updateTrackBounds();

function seedFromLenis() {
  const limit = window.lenis.limit;
  if (limit > 0 && currentLimit === 0) {
    currentLimit = limit;
    currentScroll = window.lenis.animatedScroll;
    setThumbSize(limit);
  }
}
requestAnimationFrame(() => requestAnimationFrame(seedFromLenis));

window.lenis.on('scroll', (l) => {
  const scroll = l.animatedScroll;
  const limit = l.limit;
  if (!scrollbarThumb || limit <= 0) return;

  currentScroll = scroll;
  currentLimit = limit;

  const trackH = scrollbarTrack.getBoundingClientRect().height;
  const thumbH = setThumbSize(limit);
  const maxTop = trackH - thumbH;
  scrollbarThumb.style.transform = `translateY(${(scroll / limit) * maxTop}px)`;
});

window.addEventListener('resize', () => {
  updateTrackBounds();
  if (currentLimit > 0) setThumbSize(currentLimit);
});

let dragging = false;
let dragStartY = 0;
let dragStartScroll = 0;

scrollbarThumb?.addEventListener('mousedown', (e) => {
  currentLimit = window.lenis.limit || currentLimit;
  currentScroll = window.lenis.animatedScroll;
  dragging = true;
  dragStartY = e.clientY;
  dragStartScroll = currentScroll;
  scrollbarThumb.classList.add('dragging');
  scrollbarThumb.style.setProperty('cursor', "url('/cursor-grab.svg') 12 12, grabbing", 'important');
  document.body.classList.add('scrollbar-dragging');
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const trackH = scrollbarTrack.getBoundingClientRect().height;
  const thumbH = parseFloat(scrollbarThumb.style.height) || 40;
  const maxTop = trackH - thumbH;
  const delta = ((e.clientY - dragStartY) / maxTop) * currentLimit;
  window.lenis.scrollTo(dragStartScroll + delta, { immediate: true });
});

document.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  scrollbarThumb.classList.remove('dragging');
  scrollbarThumb.style.setProperty('cursor', "url('/cursor-grab.svg') 12 12, grab", 'important');
  document.body.classList.remove('scrollbar-dragging');
});

// ===================================
// Nav Scroll (Show/Hide on scroll)
// ===================================
const nav = document.getElementById('nav');
let lastScrollY = 0;
let maxScrollY = 0;

window.lenis.on('scroll', (e) => {
  const currentScrollY = e.animatedScroll;
  if (!nav) return;

  // Fondo al hacer scroll
  nav.classList.toggle('scrolled', currentScrollY > 50);

  // Lógica de Peak Detection e Intencionalidad
  if (currentScrollY > lastScrollY) {
    // Bajando: Actualizamos el punto más bajo (peak) y ocultamos
    maxScrollY = currentScrollY;
    if (currentScrollY > 400) {
      nav.classList.add('hidden');
    }
  } else {
    // Subiendo: Solo mostramos si hemos subido una distancia considerable (150px)
    const upDistance = maxScrollY - currentScrollY;
    if (upDistance > 150 || currentScrollY < 50) {
      nav.classList.remove('hidden');
    }
  }

  // Visibilidad del botón "Conoce más" en Nav sincronizada con la visibilidad del Nav
  const navCta = nav.querySelector('.nav-cta-dynamic');
  if (navCta) {
    const isNavHidden = nav.classList.contains('hidden');
    navCta.classList.toggle('is-visible', currentScrollY > 400 && !isNavHidden);
  }

  lastScrollY = Math.max(0, currentScrollY);
});

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
function initMagneticButtons() {
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
}

// ===================================
// Animations Initializers
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

function initFavoritosCarousel() {
  const showcase = document.querySelector('.favoritos-showcase');
  const track = document.querySelector('.showcase-track');
  const items = gsap.utils.toArray('.showcase-item');
  const indicator = document.querySelector('.showcase-indicator');
  const progressBar = document.querySelector('.showcase-progress-bar');
  const nav = document.getElementById('nav');

  if (!showcase || !track || items.length === 0) return;

  const totalItems = items.length;
  let currentIndex = 0;
  let isAnimating = false;

  function goToSlide(index) {
    if (isAnimating || index < 0 || index >= totalItems) return;

    isAnimating = true;
    currentIndex = index;

    if (indicator) indicator.textContent = `${(currentIndex + 1).toString().padStart(2, '0')} / ${totalItems}`;

    gsap.to(track, {
      xPercent: -100 * currentIndex / totalItems,
      duration: 1.1,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimating = false;
        if (progressBar) progressBar.style.width = ((currentIndex / (totalItems - 1)) * 100) + '%';
      }
    });

    const item = items[currentIndex];
    gsap.fromTo(item.querySelector('.item-visual-wrap'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power3.out" });
  }

  // INTERACTION: Horizontal Only
  ScrollTrigger.create({
    trigger: showcase,
    start: "top top",
    onEnter: () => {
      if (!showcase._observer) {
        showcase._observer = Observer.create({
          target: window,
          type: "wheel,touch,pointer",
          // ONLY Horizontal Gestures move products
          onRight: () => !isAnimating && (currentIndex < totalItems - 1 ? goToSlide(currentIndex + 1) : null),
          onLeft: () => !isAnimating && (currentIndex > 0 ? goToSlide(currentIndex - 1) : null),
          tolerance: 10,
          preventDefault: false // Let vertical scroll passthrough naturally
        });
      } else {
        showcase._observer.enable();
      }
    }
  });

  // HEADER REVEAL (Manifiesto Style)
  const header = document.querySelector('.favoritos .favoritos-header');
  if (header) {
    const label = header.querySelector('.section-label');
    const title = header.querySelector('.comunidad-title');
    const desc = header.querySelector('.section-subtitle');

    gsap.set([label, title, desc], { opacity: 0, y: 50, rotateX: -30, transformOrigin: "top center" });

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.favoritos',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    headerTl.to(label, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' })
      .to(title, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power4.out' }, '-=0.6')
      .to(desc, { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.8)' }, '-=0.5');
  }

  // PINNING: Provides a stable stage for horizontal work
  const pinST = ScrollTrigger.create({
    trigger: showcase,
    pin: true,
    start: "top top",
    end: "+=800", // Standard "glance" distance
  });

  // Initial visibility check for items
  gsap.set(items, { opacity: 1 });
}

function initProcesoAnimations() {
  const panels = gsap.utils.toArray('.proceso-panel');
  const dots = gsap.utils.toArray('.proceso-dot');

  if (panels.length === 0) return;

  // Entrance animation for the INTRO panel (Step 0) - Triggers before pinning
  const intro = panels[0];
  const introBody = intro.querySelector('.proceso-panel-body');
  const introBg = intro.querySelector('.proceso-panel-bg');

  gsap.from(introBody.children, {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.proceso',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  if (introBg) {
    gsap.from(introBg, {
      scale: 1.3,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.proceso',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.proceso-sticky',
      start: 'top top',
      end: `+=${panels.length * 90}%`,
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        gsap.to('.proceso-progress-fill', { width: (self.progress * 100) + '%', duration: 0.1 });
      }
    }
  });

  panels.forEach((panel, i) => {
    const body = panel.querySelector('.proceso-panel-body');
    const bgNum = panel.querySelector('.proceso-panel-bg');
    const start = i;

    // Transition between panels - Only for steps > 0
    if (i > 0) {
      tl.to(panels[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, start)
        .to(panel, { autoAlpha: 1, y: 0, duration: 0.3 }, start)
        .to(['.proceso-counter', '.proceso-dots'], { opacity: 1, duration: 0.2 }, start)
        .set(dots[i - 1], { className: 'proceso-dot is-active' }, start)
        .set('.proceso-counter-current', { textContent: `0${i}` }, start);

      if (i > 1) {
        tl.set(dots[i - 2], { className: 'proceso-dot' }, start);
      }

      // Internal step text animations
      if (bgNum) tl.from(bgNum, { scale: 1.1, opacity: 0, duration: 0.6 }, start);
      if (body) {
        tl.from(body.children, { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, start + 0.05);
      }
    } else {
      // Step 0 stays visible initially until scrub reaches 1
      tl.set(['.proceso-counter', '.proceso-dots'], { opacity: 0 }, 0);
    }
  });
}

function initValoresAnimations() {
  const header = document.querySelector('.valores .valores-header');
  if (header) {
    const label = header.querySelector('.section-label');
    const title = header.querySelector('h2');
    const desc = header.querySelector('.section-subtitle');

    gsap.set([label, title, desc], { opacity: 0, y: 50, rotateX: -30, transformOrigin: "top center" });

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.valores',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    headerTl.to(label, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' })
      .to(title, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power4.out' }, '-=0.6')
      .to(desc, { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.8)' }, '-=0.5');
  }

  const rows = gsap.utils.toArray('.valor-row');

  rows.forEach((row, i) => {
    const num = row.querySelector('.valor-row-num');
    const main = row.querySelector('.valor-row-main');
    const arrow = row.querySelector('.valor-row-arrow');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from(row, { borderBottomColor: 'transparent', duration: 1 })
      .from(num, { opacity: 0, x: -20, duration: 0.6 }, '-=0.8')
      .from(main, { opacity: 0, y: 20, duration: 0.6 }, '-=0.6')
      .from(arrow, { opacity: 0, rotate: -45, duration: 0.6 }, '-=0.4');
  });
}

function initTestimoniosBento() {
  const container = document.querySelector('.testimonios');
  const grid = document.querySelector('.testimonios-grid');
  if (!container || !grid) return;

  // 1. Reveal Header
  gsap.from('.testimonios-header > *', {
    scrollTrigger: {
      trigger: '.testimonios-header',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // 2. Bento Grid Items Entrance
  const cards = gsap.utils.toArray('.testimonio-card');
  gsap.from(cards, {
    scrollTrigger: {
      trigger: '.testimonios-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 60,
    scale: 0.95,
    duration: 1,
    stagger: {
      amount: 0.4,
      grid: [4, 4],
      from: 'center'
    },
    ease: 'expo.out',
    force3D: true
  });  // 3. Mouse Interaction (Directly on the Card)
  cards.forEach(card => {
    // Quick setters for performance
    const xTo = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3.out" });
    const liftTo = gsap.quickTo(card, "yPercent", { duration: 0.4, ease: "power2.out" });
    const scaleTo = gsap.quickTo(card, "scale", { duration: 0.4, ease: "power2.out" });

    card.addEventListener('mouseenter', () => {
      liftTo(-5); // Elevación clara en porcentaje (no interfiere con 'y' de magnetismo)
      scaleTo(1.03);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Magnetic pull (sobre la propiedad 'x' e 'y' limpia)
      xTo((e.clientX - centerX) * 0.05);
      yTo((e.clientY - centerY) * 0.05);
    });

    card.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
      liftTo(0);
      scaleTo(1);
    });
  });

  // 4. Parallax Scroll Drifting (On the WRAPPER - Corrected for stability)
  document.querySelectorAll('.testimonio-wrapper').forEach(wrapper => {
    const card = wrapper.querySelector('.testimonio-card');
    const depth = parseFloat(card.dataset.depth || 0.1);

    // Usamos fromTo para garantizar que el punto de partida sea sólido
    gsap.fromTo(wrapper,
      { y: 40 * depth }, // Empieza un poco abajo
      {
        y: -40 * depth, // Termina un poco arriba
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper, // Gatillo individual para mayor precisión
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );
  });

  // 5. Background Text Parallax (LOVE)
  gsap.to('.testimonios-bg-text', {
    scrollTrigger: {
      trigger: '.testimonios',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2
    },
    y: 120,
    scale: 1.05,
    ease: 'none',
    force3D: true
  });

  // 6. Footer Reveal (Reforzado para visibilidad inmediata tras carga dinámica)
  gsap.from('.testimonios-footer', {
    scrollTrigger: {
      trigger: '.testimonios-footer',
      start: 'top 95%', // Se activa un poco antes para evitar que se quede oculto
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    onComplete: () => ScrollTrigger.refresh() // Refrescar una vez más al terminar
  });

  // Refrescar al cargar todo (Soluciona problemas de posición inicial)
  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 500);
  });
}

function initStatsAnimations() {
  document.querySelectorAll('.stat-num').forEach(stat => {
    const target = parseFloat(stat.dataset.count);
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(stat, {
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            const current = target * this.progress();
            stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
          }
        });
      },
      once: true
    });
  });
}

function initManifiestoAnimations() {
  gsap.set('.manifiesto-label', { opacity: 0, y: 40 });
  gsap.set('.manifiesto-line', { opacity: 0, y: 100, rotateX: -60 });
  gsap.set('.manifiesto-block', { opacity: 0, y: 80, scale: 0.9 });

  // Parallax Watermark
  gsap.fromTo('.manifiesto-parallax',
    { xPercent: -60 },
    {
      xPercent: -40,
      force3D: true,
      scrollTrigger: {
        trigger: '.manifiesto',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8
      }
    }
  );

  // Floating Bubbles
  gsap.to('.m-bubble', {
    y: 'random(-40, 40)',
    x: 'random(-20, 20)',
    duration: 'random(3, 5)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.2,
    force3D: true
  });

  gsap.to('.manifiesto-label', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  });

  gsap.to('.manifiesto-line', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top 65%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.15, ease: 'power4.out'
  });

  gsap.to('.manifiesto-block', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top 55%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.8)'
  });
}

function initEquipoAnimations() {
  // 1. Initial states - Forced via JS for maximum stability
  gsap.set('.equipo-visual', { opacity: 0, scale: 0.95 });
  gsap.set('.collage-piece', { opacity: 0, y: 60 });
  gsap.set('.equipo-info .section-label', { opacity: 0, y: 30 });
  gsap.set('.equipo-title', { opacity: 0, y: 30 });
  gsap.set('.equipo-text', { opacity: 0, y: 30 });
  gsap.set('.equipo-stat', { opacity: 0, y: 20 });
  gsap.set('.equipo-stat-sep', { scaleY: 0 });
  gsap.set('.equipo-value-item', { opacity: 0, x: -20 });

  // 2. Timeline Core - Sequential Reveal
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.equipo',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  tl.to('.equipo-visual', { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' })
    .to('.collage-piece', {
      opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out'
    }, '-=0.8')
    .to(['.equipo-info .section-label', '.equipo-title', '.equipo-text'], {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
    }, '-=0.6')
    .to('.equipo-stat', {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)'
    }, '-=0.4')
    .to('.equipo-stat-sep', { scaleY: 1, duration: 0.5 }, '-=0.4')
    .to('.equipo-value-item', {
      opacity: 1, x: 0, duration: 0.5, stagger: 0.08
    }, '-=0.3');

  // Independent Parallax for the INTERNAL content (SVG or future IMG)
  gsap.to('.piece-1 svg', {
    scrollTrigger: { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: 80, ease: 'none', force3D: true
  });
  gsap.to('.piece-2 svg', {
    scrollTrigger: { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: 120, ease: 'none', force3D: true
  });
  gsap.to('.piece-3 svg', {
    scrollTrigger: { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: 1 },
    y: 60, ease: 'none', force3D: true
  });

  // Stats Counters logic
  gsap.utils.toArray('.equipo-stat-num').forEach(stat => {
    const val = parseInt(stat.innerText);
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 90%',
      onEnter: () => {
        let obj = { value: 0 };
        gsap.to(obj, {
          value: val,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            stat.innerText = Math.floor(obj.value) + (stat.innerText.includes('+') ? '+' : '');
          }
        });
      },
      once: true
    });
  });
}

function initAboutAnimations() {
  // Animación de "caída" suave y distribuida para las palabras de fondo
  const blurWords = gsap.utils.toArray('.blur-word');
  
  blurWords.forEach((word, i) => {
    const speed = 100 + (i * 50); // Velocidades variadas
    const startY = -50 - (i * 20); // Empiezan a diferentes alturas
    
    gsap.fromTo(word, 
      { 
        y: `${startY}px`, 
        opacity: 0,
        rotate: i % 2 === 0 ? -10 : 10 
      },
      {
        scrollTrigger: {
          trigger: '.about',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        },
        y: `${speed + 200}px`, // Caen una distancia considerable
        opacity: 0.3,
        rotate: i % 2 === 0 ? 10 : -10,
        ease: 'none'
      }
    );
  });

  // Word by word text lighting up on scroll
  const words = gsap.utils.toArray('.about-w');

  gsap.set(words, { opacity: 0.15, y: 15 });

  gsap.to(words, {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 60%',
      end: 'bottom 80%',
      scrub: 1
    },
    opacity: 1,
    y: 0,
    stagger: 0.2, // Scrub ensures this cascades nicely
    ease: 'power1.out'
  });
}

function initLocationAnimations() {
  const st = { trigger: '.location', start: 'top 75%', toggleActions: 'play none none reverse' };

  gsap.from('.map-area', {
    scrollTrigger: st,
    opacity: 0, scale: 0.97, duration: 1.1, ease: 'power3.out'
  });

  gsap.from('.location-panel', {
    scrollTrigger: st,
    opacity: 0, x: 40, duration: 1, ease: 'power3.out', delay: 0.2
  });

  // Stagger individual panel elements for a premium cascade reveal
  const panelElements = [
    '.panel-city',
    '.panel-title',
    '.panel-subtitle',
    '.panel-stats',
    '.panel-feed-label',
    '.location-item:nth-child(1)',
    '.location-item:nth-child(2)',
    '.panel-footer'
  ];

  gsap.from(panelElements, {
    scrollTrigger: { trigger: '.location', start: 'top 70%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', stagger: 0.07, delay: 0.4
  });
}

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

  const isOpen = mxHour >= 10 && mxHour < 22;
  const hoursText = isOpen ? 'Abierto · 10:00 – 22:00' : 'Cerrado · Abre a las 10:00';

  const badge = document.querySelector('.panel-open-badge');
  if (badge) {
    badge.textContent = isOpen ? 'Abierto' : 'Cerrado';
    if (!isOpen) {
      badge.style.color = '#dc2626';
      badge.style.background = 'rgba(220,38,38,0.08)';
      badge.style.borderColor = 'rgba(220,38,38,0.2)';
    }
  }

  document.querySelectorAll('.location-hours').forEach(el => {
    el.textContent = hoursText;
    el.classList.toggle('closed', !isOpen);
  });
}

function initLiveFeed() {
  const counter = document.getElementById('live-count');

  if (counter) {
    // Realistic fluctuation: mostly goes up, occasionally dips
    function tickCounter() {
      const current = parseInt(counter.textContent, 10);
      const goUp = Math.random() > 0.25; // 75% chance to go up
      const delta = Math.floor(Math.random() * 4) + 1;
      const next = goUp
        ? Math.min(current + delta, current + 5)
        : Math.max(current - delta, 1);

      // Number flip micro-animation using GSAP
      gsap.to(counter, {
        opacity: 0, y: goUp ? -8 : 8, duration: 0.15, ease: 'power2.in',
        onComplete: () => {
          counter.textContent = next;
          gsap.to(counter, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });
        }
      });

      setTimeout(tickCounter, Math.random() * 5000 + 3000);
    }
    setTimeout(tickCounter, 4000);
  }

  // Flash rotation — only on items that are NOT permanently live-flash
  const items = Array.from(document.querySelectorAll('.location-item:not(.live-flash)'));
  if (!items.length) return;

  let idx = 0;
  function flashNext() {
    const item = items[idx % items.length];
    item.classList.add('live-flash');
    setTimeout(() => item.classList.remove('live-flash'), 1500);
    idx++;
    setTimeout(flashNext, Math.random() * 4000 + 3000);
  }
  setTimeout(flashNext, 3000);
}

function initFooterPearls() {
  const container = document.getElementById('footer-pearls');
  if (!container) return;

  const isMobile = window.innerWidth < 768;

  // =====================================================
  // PERFORMANCE STRATEGY:
  // Foreground sharp pearls → DOM (GPU-composited CSS animation)
  // Background blur pearls  → Single Canvas (painted once, zero reflow)
  // =====================================================

  // --- CANVAS: draw all blurred background particles once ---
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;';
  container.appendChild(canvas);

  function drawCanvasPearls() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bgLayers = [
      // Layer 4 - Profundidad media
      { count: isMobile ? 60 : 150, bottomRange: [80, 250], sizeMin: 15, sizeMax: 35, opacity: 0.35, blur: 3 },
      // Layer 5 - Ultra-blur profundo
      { count: isMobile ? 40 : 100, bottomRange: [150, 350], sizeMin: 10, sizeMax: 25, opacity: 0.2, blur: 6 },
      // Layer 6 - Atmósfera alta
      { count: isMobile ? 25 : 70, bottomRange: [200, 400], sizeMin: 5, sizeMax: 15, opacity: 0.12, blur: 8 },
      // Layer 7 - Destellos superiores
      { count: isMobile ? 20 : 55, bottomRange: [300, 450], sizeMin: 3, sizeMax: 10, opacity: 0.08, blur: 1 },
    ];

    bgLayers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        const size = Math.random() * (layer.sizeMax - layer.sizeMin) + layer.sizeMin;
        const x = Math.random() * (canvas.width + size * 2) - size;
        const bottomPx = Math.random() * (layer.bottomRange[1] - layer.bottomRange[0]) + layer.bottomRange[0];
        const y = canvas.height - bottomPx;
        const opacity = layer.opacity - Math.random() * 0.05;
        const brightness = 0.5 + Math.random() * 0.5;

        ctx.save();
        if (layer.blur > 0) ctx.filter = `blur(${layer.blur}px)`;
        ctx.globalAlpha = opacity;
        // Dark brown/black gradient — matches real tapioca pearl texture (Esfera5.webp)
        const grad = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, size * 0.05, x, y, size * 0.5);
        // Highlight: warm dark gray (like light catching the surface of a dark pearl)
        const hi = Math.round(40 + brightness * 40);   // 40–80 range (dark)
        const mid = Math.round(15 + brightness * 20);  // 15–35 range
        const dark = Math.round(5 + brightness * 10);  // 5–15 range
        grad.addColorStop(0,   `rgb(${hi + 20}, ${hi + 12}, ${hi})`);
        grad.addColorStop(0.4, `rgb(${mid + 15}, ${mid + 8}, ${mid})`);
        grad.addColorStop(1,   `rgb(${dark}, ${dark - 3}, ${dark - 5})`);
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    });
  }

  drawCanvasPearls();
  // Redraw on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawCanvasPearls, 200);
  });

  // --- DOM: only sharp foreground pearls (reduced counts for performance) ---
  const domLayers = [
    // 1. BASE DENSA (estática – zero CPU) — más densa al fondo
    { count: isMobile ? 130 : 450, bottomRange: [-60, 30], sizeMin: 40, sizeMax: 65, opacity: 1, blur: 0, animated: false },
    // 2. CAPA MEDIA (animada – moderada)
    { count: isMobile ? 35 : 70, bottomRange: [10, 80], sizeMin: 35, sizeMax: 55, opacity: 0.9, blur: 0, animated: "full", speedMult: 0.8 },
    // 3. CAPA SUPERIOR (animada – moderada)
    { count: isMobile ? 25 : 55, bottomRange: [30, 150], sizeMin: 30, sizeMax: 48, opacity: 0.8, blur: 0, animated: "full", speedMult: 1.2 },
  ];

  const fragment = document.createDocumentFragment();

  domLayers.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.count; i++) {
      const pearl = document.createElement('div');
      const isFull = layer.animated === "full";
      pearl.className = isFull ? 'footer-pearl' : 'footer-pearl-static';

      const size = Math.random() * (layer.sizeMax - layer.sizeMin) + layer.sizeMin;
      const left = Math.random() * 115 - 7.5;
      const bottom = Math.random() * (layer.bottomRange[1] - layer.bottomRange[0]) + layer.bottomRange[0];
      const brightness = 0.5 + Math.random() * 0.6;

      // Depth: layers 0,1,2 are all foreground (above products at z:30)
      const finalZIndex = 50 - layerIdx;

      Object.assign(pearl.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        bottom: `${bottom}px`,
        opacity: layer.opacity - Math.random() * 0.2,
        zIndex: finalZIndex,
      });

      if (brightness !== 1) {
        pearl.style.filter = `brightness(${brightness})`;
      }

      if (isFull) {
        pearl.style.animationDuration = `${(12 + Math.random() * 10) / (layer.speedMult || 1)}s`;
        pearl.style.animationDelay = `${Math.random() * -20}s`;
      } else {
        // Purely static — no animation, lowest possible CPU cost
        pearl.style.animation = 'none';
      }

      fragment.appendChild(pearl);
    }
  });

  container.appendChild(fragment);

  // --- IntersectionObserver: pause CSS animations when footer is off-screen ---
  const pearls = container.querySelectorAll('.footer-pearl');
  const observer = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    pearls.forEach(p => {
      p.style.animationPlayState = visible ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  observer.observe(container);

  // --- Products ---
  const products = [
    '/assets/mewis/mewi-15.png',
    '/assets/mewis/mewi-18.png'
  ];

  products.forEach((src, i) => {
    const prod = document.createElement('img');
    prod.src = src;
    prod.className = 'footer-product-float';
    prod.loading = 'lazy';
    const size = isMobile ? 140 : 220;
    const leftPos = [5, 80][i];

    Object.assign(prod.style, {
      width: `${size}px`,
      left: `${leftPos}%`,
      bottom: `${-35 + Math.random() * 20}px`,
      zIndex: 30,
      animationDuration: `${12 + Math.random() * 6}s`,
      animationDelay: `${Math.random() * -15}s`,
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
    });
    container.appendChild(prod);
  });
}

// ===================================
// Init All
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Render dynamic components
  renderFavoritos();
  renderTestimonios();

  // 2. Initialize animations
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

/**
 * Sección Comunidad - Galería Cinética
 * Marquee horizontal con velocidad reactiva al scroll
 */
function initComunidadAnimations() {
  // 1. Revelado del encabezado (Manifiesto Style) - APLICA A TODOS LOS .comunidad-hero
  document.querySelectorAll('.comunidad-hero').forEach(header => {
    const children = header.children;
    gsap.set(children, { opacity: 0, y: 50, rotateX: -30, transformOrigin: "top center" });

    gsap.to(children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
      onStart: () => {
        const last = children[children.length - 1];
        if (last) {
          gsap.to(last, { duration: 1.5, ease: 'elastic.out(1, 0.8)', delay: 0.2 });
        }
      }
    });
  });

  // 2. Efecto de velocidad reactiva al scroll
  // Cuando el usuario hace scroll rápido, las filas aceleran
  const rows = gsap.utils.toArray('.galeria-row');

  rows.forEach((row, i) => {
    gsap.to(row, {
      scrollTrigger: {
        trigger: '.galeria-cinetica',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      // Cada fila recibe un "empujón" diferente al scrollear
      x: i % 2 === 0 ? -100 : 100,
      ease: 'none'
    });
  });

  // 3. Skew dinámico basado en velocidad de scroll (Optimizado para rendimiento)
  let currentSkew = 0;
  let targetSkew = 0;
  let isSkewing = false;
  
  // Guardamos las referencias una vez para no buscar en el DOM cada frame
  const galeriaCards = gsap.utils.toArray('.galeria-card');

  const updateSkew = () => {
    currentSkew += (targetSkew - currentSkew) * 0.1;
    targetSkew *= 0.95; // Decay natural

    // Dormir el ticker si el movimiento es imperceptible
    if (Math.abs(currentSkew) < 0.05 && Math.abs(targetSkew) < 0.05) {
      currentSkew = 0;
      targetSkew = 0;
      gsap.set(galeriaCards, { skewX: 0 });
      gsap.ticker.remove(updateSkew);
      isSkewing = false;
      return;
    }
    
    // force3D: true obliga a usar GPU y evita reflows
    gsap.set(galeriaCards, { skewX: currentSkew, force3D: true });
  };

  ScrollTrigger.create({
    trigger: '.galeria-cinetica',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      targetSkew = self.getVelocity() / 500;
      targetSkew = gsap.utils.clamp(-3, 3, targetSkew);
      
      // Despertar el ticker solo cuando hay scroll
      if (Math.abs(targetSkew) > 0.1 && !isSkewing) {
        isSkewing = true;
        gsap.ticker.add(updateSkew);
      }
    }
  });

  // Pausar animaciones CSS de las filas cuando la sección no está a la vista
  const comunidadSection = document.querySelector('.comunidad');
  if (comunidadSection) {
    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries[0].isIntersecting;
      document.querySelectorAll('.galeria-track').forEach(track => {
        track.style.animationPlayState = isVisible ? 'running' : 'paused';
      });
    }, { threshold: 0 });
    observer.observe(comunidadSection);
  }

  // 4. Revelado de las filas con stagger
  gsap.from('.galeria-row', {
    scrollTrigger: {
      trigger: '.galeria-cinetica',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 80,
    duration: 1.2,
    stagger: 0.2,
  });
}

/**
 * Global Atmosphere Parallax
 * Animates floating product images across the entire vertical scroll
 */
function initGlobalParallax() {
  const assets = gsap.utils.toArray('.parallax-asset');

  assets.forEach((asset) => {
    const isProceso = asset.classList.contains('proceso-parallax-asset');
    const speed = parseFloat(asset.dataset.speed) || 0.1;

    // Core Parallax
    gsap.to(asset, {
      scrollTrigger: {
        trigger: isProceso ? '.proceso' : 'body',
        start: isProceso ? 'top bottom' : 'top top',
        end: isProceso ? 'bottom top' : 'bottom bottom',
        scrub: isProceso ? 2 : 1,
      },
      y: (index, target) => {
        const docHeight = isProceso ? window.innerHeight * 3 : document.documentElement.scrollHeight;
        return -docHeight * speed;
      },
      ease: 'none'
    });

    // Floating micro-rotation for extra organicity
    gsap.to(asset, {
      rotate: '+=15',
      duration: 3 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

