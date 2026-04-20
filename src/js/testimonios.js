import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initTestimoniosBento() {
  const container = document.querySelector('.testimonios');
  const grid = document.querySelector('.testimonios-grid');
  if (!container || !grid) return;

  gsap.from('.testimonios-header > *', {
    scrollTrigger: { trigger: '.testimonios-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: 'power3.out'
  });

  const cards = gsap.utils.toArray('.testimonio-card');
  gsap.from(cards, {
    scrollTrigger: { trigger: '.testimonios-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 60, scale: 0.95, duration: 1,
    stagger: { amount: 0.4, grid: [4, 4], from: 'center' },
    ease: 'expo.out', force3D: true
  });

  cards.forEach(card => {
    const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
    const liftTo = gsap.quickTo(card, 'yPercent', { duration: 0.4, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(card, 'scale', { duration: 0.4, ease: 'power2.out' });

    let cachedRect = null;

    card.addEventListener('mouseenter', () => {
      cachedRect = card.getBoundingClientRect();
      liftTo(-5);
      scaleTo(1.03);
    });

    card.addEventListener('mousemove', (e) => {
      if (!cachedRect) return;
      card.style.setProperty('--mouse-x', `${((e.clientX - cachedRect.left) / cachedRect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY - cachedRect.top) / cachedRect.height) * 100}%`);
      xTo((e.clientX - (cachedRect.left + cachedRect.width / 2)) * 0.05);
      yTo((e.clientY - (cachedRect.top + cachedRect.height / 2)) * 0.05);
    });

    card.addEventListener('mouseleave', () => { xTo(0); yTo(0); liftTo(0); scaleTo(1); cachedRect = null; });
  });

  const wrappers = gsap.utils.toArray('.testimonio-wrapper');
  const wrapperDepths = wrappers.map(w => parseFloat(w.querySelector('.testimonio-card')?.dataset.depth || 0.1));
  const ySetters = wrappers.map(w => gsap.quickSetter(w, 'y', 'px'));
  wrappers.forEach((w, i) => ySetters[i](40 * wrapperDepths[i]));

  ScrollTrigger.create({
    trigger: '.testimonios',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;
      for (let i = 0; i < wrappers.length; i++) {
        ySetters[i]((40 - 80 * p) * wrapperDepths[i]);
      }
    }
  });

  gsap.to('.testimonios-bg-text', {
    scrollTrigger: { trigger: '.testimonios', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    y: 120, scale: 1.05, ease: 'none', force3D: true
  });

  gsap.from('.testimonios-footer', {
    scrollTrigger: { trigger: '.testimonios-footer', start: 'top 95%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    onComplete: () => ScrollTrigger.refresh()
  });

  window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 500));
}

export function initStatsAnimations() {
  document.querySelectorAll('.stat-num').forEach(stat => {
    const target = parseFloat(stat.dataset.count);
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top bottom',
      once: true,
      onEnter: () => {
        gsap.to(stat, {
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            const current = target * this.progress();
            stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
          }
        });
      }
    });
  });
}
