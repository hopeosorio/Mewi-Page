import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initProcesoAnimations() {
  const panels = gsap.utils.toArray('.proceso-panel');
  const dots = gsap.utils.toArray('.proceso-dot');

  if (panels.length === 0) return;

  const intro = panels[0];
  const introBody = intro.querySelector('.proceso-panel-body');
  const introBg = intro.querySelector('.proceso-panel-bg');

  const introST = { trigger: '.proceso', start: 'top 80%', toggleActions: 'play none none reverse' };

  gsap.from(introBody.children, { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: introST });

  if (introBg) {
    gsap.from(introBg, { scale: 1.3, opacity: 0, duration: 1.5, ease: 'power2.out', scrollTrigger: introST });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.proceso-sticky',
      start: 'top top',
      end: `+=${panels.length * 90}%`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.4,
      onUpdate: (self) => {
        gsap.to('.proceso-progress-fill', { width: (self.progress * 100) + '%', duration: 0.1 });
      }
    }
  });

  panels.forEach((panel, i) => {
    const body = panel.querySelector('.proceso-panel-body');
    const bgNum = panel.querySelector('.proceso-panel-bg');
    const start = i;

    if (i > 0) {
      tl.to(panels[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, start)
        .to(panel, { autoAlpha: 1, y: 0, duration: 0.3 }, start)
        .to(['.proceso-counter', '.proceso-dots'], { opacity: 1, duration: 0.2 }, start)
        .set(dots[i - 1], { className: 'proceso-dot is-active' }, start)
        .set('.proceso-counter-current', { textContent: `0${i}` }, start);

      if (i > 1) tl.set(dots[i - 2], { className: 'proceso-dot' }, start);
      if (bgNum) tl.from(bgNum, { scale: 1.1, opacity: 0, duration: 0.6 }, start);
      if (body) tl.from(body.children, { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, start + 0.05);
    } else {
      tl.set(['.proceso-counter', '.proceso-dots'], { opacity: 0 }, 0);
    }
  });
}
