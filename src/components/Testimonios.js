import { testimonials } from '../data/testimonials.js';

/**
 * Genera el icono de la plataforma con un ID de gradiente único por tarjeta
 * para evitar interferencias visuales en el renderizado del DOM.
 */
function getPlatformIcon(platform, index) {
  const i = index;
  const icons = {
    Google: `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.3 132.3"><path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"/><path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-33.3-21.8-18.3z"/><path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.6 27.5-32.7-5.6-10.8-15.3-19-27-22.7L32.6 34.8c3.3-3.8 8.1-6.3 13.6-6.3"/><path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 33.3c4.8 10.6 12.8 19.2 21 29.9l34.1-40.5c-3.3 3.9-8.1 6.3-13.5 6.3"/><path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L25.6 98c2.6 3.4 5.3 7.3 7.9 11.3 9.4 14.5 6.8 23.1 12.8 23.1s3.4-8.7 12.8-23.2"/></svg>`,
    Instagram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <defs>
        <linearGradient id="ig-grad-${i}" x1="2" y1="22" x2="22" y2="2">
          <stop offset="0%" stop-color="#f09433" />
          <stop offset="25%" stop-color="#e6683c" />
          <stop offset="50%" stop-color="#dc2743" />
          <stop offset="75%" stop-color="#cc2366" />
          <stop offset="100%" stop-color="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad-${i})"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-grad-${i})"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-grad-${i})"></line>
    </svg>`,
    Facebook: `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.667 666.667"><defs><clipPath id="fb-clip-${i}" clipPathUnits="userSpaceOnUse"><path d="M0 700h700V0H0Z"/></clipPath></defs><g clip-path="url(#fb-clip-${i})" transform="matrix(1.33333 0 0 -1.33333 -133.333 800)"><path d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0" style="fill:#0866ff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(600 350)"/><path d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(447.918 273.604)"/></g></svg>`
  };
  return icons[platform] || icons.Instagram;
}

const LUCIDE_ICONS = {
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  quote: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1a1 1 0 0 1 1 1v1c0 1-1 2-2 2s-1 0-1 1v4a1 1 0 0 0 1 1z"/><path d="M15 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1a1 1 0 0 1 1 1v1c0 1-1 2-2 2s-1 0-1 1v4a1 1 0 0 0 1 1z"/></svg>`
};

function buildCard(t, index) {
  const icon = getPlatformIcon(t.platform, index);

  let sizeClass = 'card-small';
  if (t.text.length > 100) {
    sizeClass = 'card-large';
  } else if (t.text.length > 50) {
    sizeClass = 'card-medium';
  }

  const isImage = t.avatar && (t.avatar.includes('.') || t.avatar.startsWith('/') || t.avatar.startsWith('http'));
  const avatarContent = isImage
    ? `<img loading="lazy" src="${t.avatar}" alt="${t.author}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`
    : `<span>${t.avatar || t.author.substring(0, 2).toUpperCase()}</span>`;
  const avatarStyle = `background:${t.avatarColor || 'var(--color-accent-1)'}; overflow: hidden;`;

  const starsHtml = t.stars ? `<div class="testimonio-stars">${'★'.repeat(t.stars)}</div>` : '';

  return `
    <div class="testimonio-wrapper">
      <div class="testimonio-card ${sizeClass}" data-depth="${Math.random() * 0.4 + 0.1}">
        <div class="testimonio-noise"></div>
        <div class="testimonio-glow"></div>
        <div class="card-decoration">${LUCIDE_ICONS.quote}</div>
        
        <div class="testimonio-top">
          ${starsHtml}
          <div class="testimonio-badge">
            <div class="testimonio-platform">
              ${icon}
              <span>${t.platform || 'Instagram'}</span>
            </div>
          </div>
        </div>

        <p class="testimonio-text">"${t.text}"</p>

        <div class="testimonio-author">
          <div class="avatar-wrapper">
            <div class="author-avatar" style="${avatarStyle}">
              ${avatarContent}
            </div>
            <div class="heart-badge">${LUCIDE_ICONS.heart}</div>
          </div>
          <div class="author-info">
            <span class="author-name">${t.author}</span>
            <span class="author-role">${t.role}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderTestimonios() {
  const container = document.getElementById('testimonios-grid');
  if (!container) return;
  container.innerHTML = testimonials.map((t, i) => buildCard(t, i)).join('');
}
