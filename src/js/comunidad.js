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
    gsap.to(row, { scrollTrigger: galeriaST, x: i % 2 === 0 ? -100 : 100, ease: 'none' });
  });

  let currentSkew = 0;
  let targetSkew = 0;
  let isSkewing = false;
  const galeriaCards = gsap.utils.toArray('.galeria-card');

  const updateSkew = () => {
    currentSkew += (targetSkew - currentSkew) * 0.1;
    targetSkew *= 0.95;

    if (Math.abs(currentSkew) < 0.05 && Math.abs(targetSkew) < 0.05) {
      currentSkew = 0;
      targetSkew = 0;
      gsap.set(galeriaCards, { skewX: 0 });
      gsap.ticker.remove(updateSkew);
      isSkewing = false;
      return;
    }
    gsap.set(galeriaCards, { skewX: currentSkew, force3D: true });
  };

  ScrollTrigger.create({
    trigger: '.galeria-cinetica',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      targetSkew = gsap.utils.clamp(-3, 3, self.getVelocity() / 500);
      if (Math.abs(targetSkew) > 0.1 && !isSkewing) {
        isSkewing = true;
        gsap.ticker.add(updateSkew);
      }
    }
  });

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

  gsap.from('.galeria-row', {
    scrollTrigger: { trigger: '.galeria-cinetica', start: 'top 80%', toggleActions: 'play none none reverse' },
    opacity: 0, y: 80, duration: 1.2, stagger: 0.2
  });
}
