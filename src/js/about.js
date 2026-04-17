import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAboutAnimations() {
  const blurWords = gsap.utils.toArray('.blur-word');

  const blurWordData = blurWords.map((word, i) => ({
    word,
    startY: -50 - (i * 20),
    endY: 300 + (i * 50),
    startR: i % 2 === 0 ? -10 : 10,
    endR: i % 2 === 0 ? 10 : -10,
  }));

  blurWordData.forEach(({ word, startY, startR }) => {
    gsap.set(word, { y: startY, opacity: 0, rotate: startR });
  });

  ScrollTrigger.create({
    trigger: '.about',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress;
      blurWordData.forEach(({ word, startY, endY, startR, endR }) => {
        gsap.set(word, {
          y: startY + (endY - startY) * p,
          opacity: 0.3 * p,
          rotate: startR + (endR - startR) * p,
          force3D: true
        });
      });
    }
  });

  const words = gsap.utils.toArray('.about-w');
  gsap.set(words, { opacity: 0.15, y: 15 });

  gsap.to(words, {
    scrollTrigger: { trigger: '.about', start: 'top 60%', end: 'bottom 80%', scrub: 1 },
    opacity: 1,
    y: 0,
    stagger: 0.2,
    ease: 'power1.out'
  });
}
