import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initManifiestoAnimations() {
  gsap.set('.manifiesto-label', { opacity: 0, y: 40 });
  gsap.set('.manifiesto-line', { opacity: 0, y: 100, rotateX: -60 });
  gsap.set('.manifiesto-block', { opacity: 0, y: 80, scale: 0.9 });

  gsap.fromTo('.manifiesto-parallax',
    { xPercent: -60 },
    {
      xPercent: -40,
      force3D: true,
      scrollTrigger: { trigger: '.manifiesto', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    }
  );

  gsap.to('.m-bubble', {
    y: 'random(-40, 40)', x: 'random(-20, 20)',
    duration: 'random(3, 5)', repeat: -1, yoyo: true, ease: 'sine.inOut',
    stagger: 0.2, force3D: true
  });

  gsap.to('.manifiesto-label', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top 75%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  });

  gsap.to('.manifiesto-line', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top 65%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.15, ease: 'power4.out'
  });

  gsap.to('.manifiesto-block', {
    scrollTrigger: { trigger: '.manifiesto', start: 'top 55%', toggleActions: 'play none none reverse' },
    opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.8)'
  });
}
