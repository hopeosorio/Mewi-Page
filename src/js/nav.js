import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll a una sección en mobile (sin Lenis). El documento CRECE mientras bajas:
// los spacers de los pins (favoritos, proceso) se expanden al recorrerlos, así que la
// posición de la sección es un blanco móvil. Ease por tiempo (~900ms) re-midiendo el
// destino cada frame + fase settle final; ScrollTrigger.update() asienta los pins.
function scrollToSection(target) {
  const getY = () => target.getBoundingClientRect().top + window.scrollY - 60;
  const startY = window.scrollY;
  const t0 = performance.now();
  const dur = 900;
  const ease = (p) => 1 - Math.pow(1 - p, 3); // easeOutCubic
  let settle = 0;
  const step = (now) => {
    const dest = getY(); // re-medido cada frame: persigue el doc que crece
    const p = Math.min(1, (now - t0) / dur);
    if (p < 1) {
      window.scrollTo(0, startY + (dest - startY) * ease(p));
      ScrollTrigger.update();
      requestAnimationFrame(step);
    } else {
      // Fase settle: los pins pueden expandir el doc justo al final (init lazy);
      // engancha a la posición real hasta estabilizar (o tope de 60 frames).
      window.scrollTo(0, dest);
      ScrollTrigger.update();
      if (Math.abs(getY() - window.scrollY) > 1 && settle++ < 60) requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

export function initNav() {
  const nav = document.getElementById('nav');
  const navCta = nav?.querySelector('.nav-cta-dynamic');
  let lastScrollY = 0;
  let scrollDownStart = null;
  let scrollUpAccum = 0;

  const onScroll = (currentScrollY) => {
    if (!nav) return;

    nav.classList.toggle('scrolled', currentScrollY > 50);

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
      // Visibilidad SOLO por scroll, desacoplada de .hidden: el CTA es hijo del nav,
      // así que al ocultarse el nav (opacity) el CTA se desvanece con él. Si se atara
      // a !hidden, cada hide/show re-dispararía su animación de entrada (translateY+
      // scale) = el "salto" al salir de la primera sección.
      navCta.classList.toggle('is-visible', currentScrollY > 400);
    }
  };

  if (window.lenis) {
    window.lenis.on('scroll', (e) => onScroll(e.animatedScroll));
  } else {
    let rafId = null;
    window.addEventListener('scroll', () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        onScroll(window.scrollY);
        rafId = null;
      });
    }, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -60 });
      } else {
        scrollToSection(target);
      }
    });
  });

  initMobileMenu();
}

// Menú móvil desplegable (usado por la landing y las subpáginas)
export function initMobileMenu() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  if (!burger || !mobileMenu || !nav) return;

  // El CTA del menú solo aparece pasando la primera sección (>400px). En el hero ya
  // está el "Conoce más" de hero-actions → evitar duplicarlo.
  const mobileCta = mobileMenu.querySelector('.nav-mobile-cta');
  if (mobileCta) {
    const syncCta = () => mobileCta.classList.toggle('is-hidden', (window.scrollY || 0) <= 400);
    syncCta();
    window.addEventListener('scroll', syncCta, { passive: true });
  }

  const closeMenu = () => {
    if (!mobileMenu.classList.contains('open')) return;
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !mobileMenu.classList.contains('open');
    if (willOpen) {
      // el menú es fixed y hermano del nav: alinearlo bajo el pill
      mobileMenu.style.top = `${nav.getBoundingClientRect().bottom + 8}px`;
    }
    mobileMenu.classList.toggle('open', willOpen);
    burger.classList.toggle('open', willOpen);
    burger.setAttribute('aria-expanded', String(willOpen));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !nav.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', closeMenu, { passive: true });
}

export function initMagneticButtons() {
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
