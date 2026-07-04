const STORAGE_KEY = 'mewi-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

// Nota iOS 26+: Safari ignora el meta `theme-color`. El color de la barra sale del
// background-color del body (o de un elem fixed cerca del borde) y solo se deriva en
// el render/carga; los cambios dinámicos NO repintan la barra (bug WebKit, fix ~iOS
// 26.2). Al recargar sale bien porque body usa --color-bg del tema. No hay workaround
// web fiable, así que no se toca la barra por JS.
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  if ('startViewTransition' in document) {
    document.startViewTransition(() => applyTheme(next));
  } else {
    applyTheme(next);
  }
}

export function initTheme() {
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', toggleTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });
}
