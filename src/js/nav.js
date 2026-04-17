import gsap from 'gsap';

export function initNav() {
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let maxScrollY = 0;

  window.lenis.on('scroll', (e) => {
    const currentScrollY = e.animatedScroll;
    if (!nav) return;

    nav.classList.toggle('scrolled', currentScrollY > 50);

    if (currentScrollY > lastScrollY) {
      maxScrollY = currentScrollY;
      if (currentScrollY > 400) nav.classList.add('hidden');
    } else {
      const upDistance = maxScrollY - currentScrollY;
      if (upDistance > 150 || currentScrollY < 50) nav.classList.remove('hidden');
    }

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
      if (target) window.lenis.scrollTo(target, { offset: -100 });
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
