import { products } from '../data/products.js';

export function renderFavoritos() {
  const container = document.querySelector('.showcase-track');
  if (!container) return;
  
  container.innerHTML = products.map((product, i) => `
    <div class="showcase-item" style="--accent: ${product.accentColor}">
      <div class="item-bg-text">${product.name.replace(/\s+/g, '<br>')}</div>
      <div class="item-visual-wrap">
        <div class="item-glow"></div>
        <div class="item-main">
          <img src="${product.image}" alt="${product.name}" class="showcase-img">
        </div>
        <div class="item-reflection">
          <img src="${product.image}" alt="Reflect" class="showcase-img-reflect">
        </div>
      </div>
      <div class="item-info">
        <span class="item-tag">${product.tag || 'MEWI Selection'}</span>
        <h3 class="item-title">${product.name}</h3>
        <p class="item-desc">${product.desc}</p>
      </div>
    </div>
  `).join('');
}
