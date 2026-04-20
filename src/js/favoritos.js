import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

export function initFavoritosCarousel() {
  const showcase = document.querySelector('.favoritos-showcase');
  const track = document.querySelector('.showcase-track');
  const items = gsap.utils.toArray('.showcase-item');
  const indicator = document.querySelector('.showcase-indicator');
  const progressBar = document.querySelector('.showcase-progress-bar');

  if (!showcase || !track || items.length === 0) return;

  const totalItems = items.length;
  const isMobile = window.innerWidth <= 768;

  const header = document.querySelector('.favoritos .favoritos-header');
  if (header) {
    const label = header.querySelector('.section-label');
    const title = header.querySelector('.comunidad-title');
    const desc = header.querySelector('.section-subtitle');

    gsap.set([label, title, desc], { opacity: 0, y: 50, rotateX: -30, transformOrigin: 'top center' });

    gsap.timeline({
      scrollTrigger: { trigger: '.favoritos', start: 'top 85%', toggleActions: 'play none none reverse' }
    })
      .to(label, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' })
      .to(title, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power4.out' }, '-=0.6')
      .to(desc, { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.8)' }, '-=0.5');
  }

  gsap.set(items, { opacity: 1 });

  if (isMobile) {

    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchStartY = 0;

    function goToSlideMobile(index) {
      if (isAnimating || index < 0 || index >= totalItems) return;
      isAnimating = true;
      currentIndex = index;
      if (indicator) indicator.textContent = `${(index + 1).toString().padStart(2, '0')} / ${totalItems}`;
      gsap.to(track, {
        xPercent: -100 * index / totalItems,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => {
          isAnimating = false;
          if (progressBar) progressBar.style.width = ((index / (totalItems - 1)) * 100) + '%';
        }
      });
    }

    showcase.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    showcase.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 0.8) return;
      if (dx < 0) goToSlideMobile(currentIndex + 1);
      else goToSlideMobile(currentIndex - 1);
    }, { passive: true });

    return;
  }

  let currentIndex = 0;
  let isAnimating = false;

  function goToSlide(index) {
    if (isAnimating || index < 0 || index >= totalItems) return;
    isAnimating = true;
    currentIndex = index;

    if (indicator) indicator.textContent = `${(currentIndex + 1).toString().padStart(2, '0')} / ${totalItems}`;

    gsap.to(track, {
      xPercent: -100 * currentIndex / totalItems,
      duration: 1.1,
      ease: 'power3.inOut',
      onComplete: () => {
        isAnimating = false;
        if (progressBar) progressBar.style.width = ((currentIndex / (totalItems - 1)) * 100) + '%';
      }
    });

    const item = items[currentIndex];
    gsap.fromTo(
      item.querySelector('.item-visual-wrap'),
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }

  ScrollTrigger.create({
    trigger: showcase,
    pin: true,
    start: 'top top',
    end: '+=800',
    onEnter: () => {
      if (!showcase._observer) {
        showcase._observer = Observer.create({
          target: window,
          type: 'wheel,touch,pointer',
          onRight: () => !isAnimating && (currentIndex < totalItems - 1 ? goToSlide(currentIndex + 1) : null),
          onLeft: () => !isAnimating && (currentIndex > 0 ? goToSlide(currentIndex - 1) : null),
          tolerance: 10,
          preventDefault: false
        });
      } else {
        showcase._observer.enable();
      }
    },
    onLeave: () => showcase._observer?.disable(),
    onLeaveBack: () => showcase._observer?.disable(),
    onEnterBack: () => showcase._observer?.enable(),
  });
}
