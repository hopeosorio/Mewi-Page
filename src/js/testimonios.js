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

  const hasHover = window.matchMedia('(hover: hover)').matches;

  if (hasHover) {
    cards.forEach(card => {
      const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
      const liftTo = gsap.quickTo(card, 'yPercent', { duration: 0.4, ease: 'power2.out' });
      const scaleTo = gsap.quickTo(card, 'scale', { duration: 0.4, ease: 'power2.out' });

      let cachedRect = null;
      let mouseRafId = null;

      card.addEventListener('mouseenter', () => {
        cachedRect = card.getBoundingClientRect();
        liftTo(-5);
        scaleTo(1.03);
      });

      card.addEventListener('mousemove', (e) => {
        if (!cachedRect || mouseRafId) return;
        const cx = e.clientX, cy = e.clientY;
        mouseRafId = requestAnimationFrame(() => {
          card.style.setProperty('--mouse-x', `${((cx - cachedRect.left) / cachedRect.width) * 100}%`);
          card.style.setProperty('--mouse-y', `${((cy - cachedRect.top) / cachedRect.height) * 100}%`);
          xTo((cx - (cachedRect.left + cachedRect.width / 2)) * 0.05);
          yTo((cy - (cachedRect.top + cachedRect.height / 2)) * 0.05);
          mouseRafId = null;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (mouseRafId) { cancelAnimationFrame(mouseRafId); mouseRafId = null; }
        xTo(0); yTo(0); liftTo(0); scaleTo(1); cachedRect = null;
      });
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
  }

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

// Carrusel móvil: cada card mide igual (340px). El texto largo se corta limpio (CSS); el texto
// corto se agranda y se centra para llenar el espacio. Solo clasifica; sin botón ni expand.
export function initTestimonialReadMore() {
  const mq = window.matchMedia('(max-width: 768px)');
  const cards = Array.from(document.querySelectorAll('.testimonio-card'));

  const sync = () => {
    cards.forEach((card) => {
      const text = card.querySelector('.testimonio-text');
      if (!text) return;
      card.classList.remove('is-short');
      if (!mq.matches) return;
      // corto = el texto NO se desborda del recorte → agrandar y centrar.
      const overflowing = text.scrollHeight > text.clientHeight + 2;
      if (!overflowing) card.classList.add('is-short');
    });
  };

  sync();
  window.addEventListener('resize', sync);
  mq.addEventListener?.('change', sync);
}

// Indicador (puntos) del carrusel móvil: uno por testimonio, marca el activo según el scroll
// y al tocar un punto desplaza a esa card. Se oculta en desktop por CSS.
export function initTestimonialDots() {
  const grid = document.querySelector('.testimonios-grid');
  const dotsWrap = document.getElementById('testi-dots');
  const wrappers = Array.from(document.querySelectorAll('.testimonio-wrapper'));
  if (!grid || !dotsWrap || !wrappers.length) return;

  dotsWrap.innerHTML = '';
  const dots = wrappers.map((w, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'testi-dot' + (i === 0 ? ' is-active' : '');
    b.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
    b.addEventListener('click', () => w.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }));
    dotsWrap.appendChild(b);
    return b;
  });

  let raf = null;
  const update = () => {
    raf = null;
    const gridRect = grid.getBoundingClientRect();
    const center = gridRect.left + gridRect.width / 2;
    let best = 0, bestDist = Infinity;
    wrappers.forEach((w, i) => {
      const r = w.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === best));
  };

  grid.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  update();
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
