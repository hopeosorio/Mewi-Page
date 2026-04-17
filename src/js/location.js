import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initLocationAnimations() {
  const st = { trigger: '.location', start: 'top 75%', toggleActions: 'play none none reverse' };

  gsap.from('.map-area', { scrollTrigger: st, opacity: 0, scale: 0.97, duration: 1.1, ease: 'power3.out' });
  gsap.from('.location-panel', { scrollTrigger: st, opacity: 0, x: 40, duration: 1, ease: 'power3.out', delay: 0.2 });

  gsap.from([
    '.panel-city', '.panel-title', '.panel-subtitle', '.panel-stats',
    '.panel-feed-label', '.location-item:nth-child(1)', '.location-item:nth-child(2)', '.panel-footer'
  ], {
    scrollTrigger: { trigger: '.location', start: 'top 70%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', stagger: 0.07, delay: 0.4
  });
}

export function initOpenStatus() {
  const now = new Date();
  const mxHour = parseInt(
    new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City', hour: 'numeric', hour12: false
    }).format(now), 10
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

export function initLiveFeed() {
  const counter = document.getElementById('live-count');

  if (counter) {
    function tickCounter() {
      const current = parseInt(counter.textContent, 10);
      const goUp = Math.random() > 0.25;
      const delta = Math.floor(Math.random() * 4) + 1;
      const next = goUp ? Math.min(current + delta, current + 5) : Math.max(current - delta, 1);

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
