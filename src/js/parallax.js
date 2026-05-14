import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGlobalParallax() {
  if (('ontouchstart' in window) || navigator.maxTouchPoints > 0) return;
  gsap.utils.toArray('.parallax-asset').forEach((asset) => {
    const isProceso = asset.classList.contains('proceso-parallax-asset');
    const speed = parseFloat(asset.dataset.speed) || 0.1;

    gsap.to(asset, {
      scrollTrigger: {
        trigger: isProceso ? '.proceso' : 'body',
        start: isProceso ? 'top bottom' : 'top top',
        end: isProceso ? 'bottom top' : 'bottom bottom',
        scrub: isProceso ? 2 : 1,
      },
      y: () => {
        const docHeight = isProceso ? window.innerHeight * 3 : document.documentElement.scrollHeight;
        return -docHeight * speed;
      },
      ease: 'none'
    });

    const rotateTween = gsap.to(asset, {
      rotate: '+=15',
      duration: 3 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      paused: true,
    });

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? rotateTween.resume() : rotateTween.pause();
    }, { rootMargin: '100px' });
    visibilityObserver.observe(asset);
  });
}
