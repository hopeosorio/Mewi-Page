import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'vite-plugin-compression';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function htmlIncludePlugin() {
  return {
    name: 'html-include',
    transformIndexHtml(html) {
      return html.replace(/<!--\s*@include\s+([\w\/.\-]+)\s*-->/g, (match, file) => {
        try {
          return fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
        } catch (e) {
          return `<!-- include not found: ${file} -->`;
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    htmlIncludePlugin(),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        privacidad: 'privacidad.html',
        soporte: 'soporte.html',
        'eliminar-cuenta': 'eliminar-cuenta.html',
      }
    }
  },
  optimizeDeps: {
    include: ['gsap']
  }
});
