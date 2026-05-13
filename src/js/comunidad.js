import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initComunidadAnimations() {
  document.querySelectorAll('.comunidad-hero').forEach(header => {
    const children = header.children;
    gsap.set(children, { opacity: 0, y: 50, rotateX: -30, transformOrigin: 'top center' });

    gsap.to(children, {
      scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out',
      onStart: () => {
        const last = children[children.length - 1];
        if (last) gsap.to(last, { duration: 1.5, ease: 'elastic.out(1, 0.8)', delay: 0.2 });
      }
    });
  });

  const galeriaST = { trigger: '.galeria-cinetica', start: 'top bottom', end: 'bottom top', scrub: 0.5 };
  gsap.utils.toArray('.galeria-row').forEach((row, i) => {
    gsap.to(row, { scrollTrigger: galeriaST, x: i % 2 === 0 ? -50 : 50, ease: 'none' });
  });


  const comunidadSection = document.querySelector('.comunidad');
  if (comunidadSection) {
    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries[0].isIntersecting;
      document.querySelectorAll('.galeria-track').forEach(track => {
        // Empty string removes inline style so CSS :hover rule can take effect when visible
        track.style.animationPlayState = isVisible ? '' : 'paused';
      });
    }, { threshold: 0 });
    observer.observe(comunidadSection);
  }

  gsap.from('.galeria-row', {
    scrollTrigger: { trigger: '.galeria-cinetica', start: 'top 80%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 80, duration: 1.2, stagger: 0.2
  });
}
