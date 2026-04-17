import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGlobalParallax() {
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

    gsap.to(asset, {
      rotate: '+=15',
      duration: 3 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}
