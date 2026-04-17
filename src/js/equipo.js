import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initEquipoAnimations() {
  gsap.set('.equipo-visual', { opacity: 0, scale: 0.95 });
  gsap.set('.collage-piece', { opacity: 0, y: 60 });
  gsap.set('.equipo-info .section-label', { opacity: 0, y: 30 });
  gsap.set('.equipo-title', { opacity: 0, y: 30 });
  gsap.set('.equipo-text', { opacity: 0, y: 30 });
  gsap.set('.equipo-stat', { opacity: 0, y: 20 });
  gsap.set('.equipo-stat-sep', { scaleY: 0 });
  gsap.set('.equipo-value-item', { opacity: 0, x: -20 });

  gsap.timeline({
    scrollTrigger: { trigger: '.equipo', start: 'top 80%', toggleActions: 'play none none reverse' }
  })
    .to('.equipo-visual', { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' })
    .to('.collage-piece', { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.8')
    .to(['.equipo-info .section-label', '.equipo-title', '.equipo-text'], {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
    }, '-=0.6')
    .to('.equipo-stat', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.4')
    .to('.equipo-stat-sep', { scaleY: 1, duration: 0.5 }, '-=0.4')
    .to('.equipo-value-item', { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 }, '-=0.3');

  const equipoST = { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.piece-1 svg', { scrollTrigger: equipoST, y: 80, ease: 'none', force3D: true });
  gsap.to('.piece-2 svg', { scrollTrigger: equipoST, y: 120, ease: 'none', force3D: true });
  gsap.to('.piece-3 svg', { scrollTrigger: equipoST, y: 60, ease: 'none', force3D: true });

  gsap.utils.toArray('.equipo-stat-num').forEach(stat => {
    const val = parseInt(stat.innerText);
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const obj = { value: 0 };
        gsap.to(obj, {
          value: val,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            stat.innerText = Math.floor(obj.value) + (stat.innerText.includes('+') ? '+' : '');
          }
        });
      }
    });
  });
}
