import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initValoresAnimations() {
  const header = document.querySelector('.valores .valores-header');
  if (header) {
    const label = header.querySelector('.section-label');
    const title = header.querySelector('h2');
    const desc = header.querySelector('.section-subtitle');

    gsap.set([label, title, desc], { opacity: 0, y: 50, rotateX: -30, transformOrigin: 'top center' });

    gsap.timeline({
      scrollTrigger: { trigger: '.valores', start: 'top 85%', toggleActions: 'play none none reverse' }
    })
      .to(label, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' })
      .to(title, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power4.out' }, '-=0.6')
      .to(desc, { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.8)' }, '-=0.5');
  }

  gsap.utils.toArray('.valor-row').forEach(row => {
    const num = row.querySelector('.valor-row-num');
    const main = row.querySelector('.valor-row-main');
    const arrow = row.querySelector('.valor-row-arrow');

    gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none reverse' }
    })
      .from(row, { borderBottomColor: 'transparent', duration: 1 })
      .from(num, { opacity: 0, x: -20, duration: 0.6 }, '-=0.8')
      .from(main, { opacity: 0, y: 20, duration: 0.6 }, '-=0.6')
      .from(arrow, { opacity: 0, rotate: -45, duration: 0.6 }, '-=0.4');
  });
}
