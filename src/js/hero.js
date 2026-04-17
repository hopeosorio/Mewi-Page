import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('.line-inner', { y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' })
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-actions', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.scroll-indicator', { opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');

  gsap.to('.hero-content', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: 150, opacity: 0
  });
  gsap.to('.orb-1', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    x: 200, y: -100
  });
  gsap.to('.orb-2', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    x: -200, y: 100
  });
}
