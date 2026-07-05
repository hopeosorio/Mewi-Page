// Disuasivo de inspección casual — NO es seguridad. El HTML/CSS/JS de un sitio
// estático siempre es accesible (ver-fuente del navegador, deshabilitar JS, proxy);
// esto solo frena al usuario casual. Solo se activa en el build de producción para
// no estorbar el desarrollo.
export function initProtect() {
  if (!import.meta.env.PROD) return;

  // Clic derecho
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Atajos de devtools y ver-fuente
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) ||
      (e.ctrlKey && (k === 'u' || k === 'f'))
    ) {
      e.preventDefault();
    }
  });

  // Silenciar salida de consola de la app
  for (const m of ['log', 'debug', 'info', 'warn', 'table', 'dir']) {
    console[m] = () => {};
  }
}
