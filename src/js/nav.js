import gsap from 'gsap';

export function initNav() {
  const nav = document.getElementById('nav');
  const navCta = nav?.querySelector('.nav-cta-dynamic');
  let lastScrollY = 0;
  let scrollUpStart = null;
  let navShownAtY = null;

  const onScroll = (currentScrollY) => {
    if (!nav) return;

    nav.classList.toggle('scrolled', currentScrollY > 50);

    const isScrollingDown = currentScrollY > lastScrollY;
    const isNavHidden = nav.classList.contains('hidden');

    if (isScrollingDown) {
      scrollUpStart = null;
      if (currentScrollY > 400) {
        const downFromShown = navShownAtY !== null ? currentScrollY - navShownAtY : Infinity;
        if (downFromShown > 60) {
          nav.classList.add('hidden');
          navShownAtY = null;
        }
      }
    } else {
      if (scrollUpStart === null) scrollUpStart = lastScrollY;
      const upDistance = scrollUpStart - currentScrollY;
      if (isNavHidden && (upDistance > 80 || currentScrollY < 100)) {
        nav.classList.remove('hidden');
        navShownAtY = currentScrollY;
        scrollUpStart = null;
      }
    }

    if (navCta) {
      navCta.classList.toggle('is-visible', currentScrollY > 400 && !nav.classList.contains('hidden'));
    }

    lastScrollY = Math.max(0, currentScrollY);
  };

  if (window.lenis) {
    window.lenis.on('scroll', (e) => onScroll(e.animatedScroll));
  } else {
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -100 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
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
