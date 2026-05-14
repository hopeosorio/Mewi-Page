export function initScrollbar() {
  if (!window.lenis) return;

  const scrollbarTrack = document.createElement('div');
  scrollbarTrack.id = 'custom-scrollbar';
  scrollbarTrack.setAttribute('aria-hidden', 'true');
  scrollbarTrack.style.setProperty('cursor', "url('/cursors/cursor-default.svg') 1 1, auto", 'important');

  const scrollbarThumb = document.createElement('div');
  scrollbarThumb.id = 'custom-scrollbar-thumb';
  scrollbarThumb.style.setProperty('cursor', "url('/cursors/cursor-grab.svg') 12 12, grab", 'important');

  scrollbarTrack.appendChild(scrollbarThumb);
  document.body.appendChild(scrollbarTrack);

  let currentScroll = 0;
  let currentLimit = 0;

  function getNavOffset() {
    const navEl = document.getElementById('nav');
    return navEl ? navEl.getBoundingClientRect().height : 80;
  }

  function updateTrackBounds() {
    scrollbarTrack.style.top = `${getNavOffset()}px`;
  }

  function setThumbSize(limit) {
    const trackH = scrollbarTrack.getBoundingClientRect().height;
    const thumbH = Math.max((trackH / (limit + trackH)) * trackH, 40);
    scrollbarThumb.style.height = `${thumbH}px`;
    return thumbH;
  }

  requestAnimationFrame(updateTrackBounds);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const limit = window.lenis.limit;
    if (limit > 0 && currentLimit === 0) {
      currentLimit = limit;
      currentScroll = window.lenis.animatedScroll;
      setThumbSize(limit);
    }
  }));

  window.lenis.on('scroll', (l) => {
    const scroll = l.animatedScroll;
    const limit = l.limit;
    if (limit <= 0) return;

    currentScroll = scroll;
    currentLimit = limit;

    const trackH = scrollbarTrack.getBoundingClientRect().height;
    const thumbH = setThumbSize(limit);
    const maxTop = trackH - thumbH;
    scrollbarThumb.style.transform = `translateY(${(scroll / limit) * maxTop}px)`;
  });

  window.addEventListener('resize', () => {
    updateTrackBounds();
    if (currentLimit > 0) setThumbSize(currentLimit);
  });

  let dragging = false;
  let dragStartY = 0;
  let dragStartScroll = 0;

  scrollbarThumb.addEventListener('mousedown', (e) => {
    currentLimit = window.lenis.limit || currentLimit;
    currentScroll = window.lenis.animatedScroll;
    dragging = true;
    dragStartY = e.clientY;
    dragStartScroll = currentScroll;
    scrollbarThumb.classList.add('dragging');
    scrollbarThumb.style.setProperty('cursor', "url('/cursors/cursor-grab.svg') 12 12, grabbing", 'important');
    document.body.classList.add('scrollbar-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const trackH = scrollbarTrack.getBoundingClientRect().height;
    const thumbH = parseFloat(scrollbarThumb.style.height) || 40;
    const maxTop = trackH - thumbH;
    const delta = ((e.clientY - dragStartY) / maxTop) * currentLimit;
    window.lenis.scrollTo(dragStartScroll + delta, { immediate: true });
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    scrollbarThumb.classList.remove('dragging');
    scrollbarThumb.style.setProperty('cursor', "url('/cursors/cursor-grab.svg') 12 12, grab", 'important');
    document.body.classList.remove('scrollbar-dragging');
  });
}
