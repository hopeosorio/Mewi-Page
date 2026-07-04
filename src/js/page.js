import Lenis from 'lenis';
import gsap from 'gsap';

function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  window.lenis = lenis;
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mewi-theme', next);
  });
}

function initNav() {
  const nav = document.getElementById('nav');
  const navCta = nav?.querySelector('.nav-cta-dynamic');
  if (!nav) return;

  // Sub-pages: always show scrolled (frosted glass) state
  nav.classList.add('scrolled');

  let lastScrollY = 0;
  let scrollDownStart = null;
  let scrollUpAccum = 0;

  const onScroll = (currentScrollY) => {
    const delta = currentScrollY - lastScrollY;
    lastScrollY = Math.max(0, currentScrollY);
    if (Math.abs(delta) < 1) return;
    const isNavHidden = nav.classList.contains('hidden');
    if (currentScrollY < 100) {
      nav.classList.remove('hidden');
      scrollDownStart = null;
      scrollUpAccum = 0;
    } else if (delta > 0) {
      scrollUpAccum = 0;
      if (scrollDownStart === null) scrollDownStart = currentScrollY;
      if (!isNavHidden && currentScrollY > 400 && (currentScrollY - scrollDownStart) > 80) {
        nav.classList.add('hidden');
        scrollDownStart = null;
      }
    } else {
      scrollDownStart = null;
      scrollUpAccum += Math.abs(delta);
      if (isNavHidden && scrollUpAccum > 60) {
        nav.classList.remove('hidden');
        scrollUpAccum = 0;
      }
    }
    if (navCta) {
      // Solo por scroll, desacoplado de .hidden (evita re-disparar la animación de
      // entrada del CTA en cada hide/show). Ver nota en nav.js.
      navCta.classList.toggle('is-visible', currentScrollY > 400);
    }
  };

  window.lenis.on('scroll', (e) => onScroll(e.animatedScroll));
}

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initTheme();
  initNav();
});
