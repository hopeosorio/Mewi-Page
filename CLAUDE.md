# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000 (opens browser automatically)
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

No linting or test tooling is configured.

## Project Overview

Static landing page for **MEWI**, an artisan bubble tea brand (content in Spanish). Built with plain HTML/CSS/JS — no frontend framework.

**Stack:**
- **Vite** — bundler/dev server (port 3000)
- **GSAP** (gsap, ScrollTrigger, ScrollToPlugin) — all scroll-driven and entrance animations
- **Lenis** — smooth scroll, integrated with GSAP's ticker
- **Three.js** — interactive 3D globe in the location section

## Architecture

### Entry points
- `index.html` — single-page HTML with all sections inline
- `main.js` — imports GSAP + Lenis, imports `globe.js` as a side-effect, then registers all animation functions called on `DOMContentLoaded`
- `globe.js` — self-contained Three.js globe; initializes on its own `DOMContentLoaded` listener

### Three.js dual-load quirk
Three.js is loaded **twice**: via CDN `<script>` tag in `index.html` (sets `window.THREE`) and as an npm dependency. `globe.js` uses `window.THREE` from the CDN, not the npm import. The npm package is only referenced by the build config for chunk splitting (`manualChunks: { three: ['three'] }`). Do not remove the CDN script tag or `globe.js` will break silently (it guards with `if (!window.THREE) return`).

### Animation pattern in `main.js`
Each section has its own `init*Animations()` function (e.g., `initHeroAnimations`, `initFavoritosAnimations`). All are called sequentially inside `document.fonts.ready.then(...)`. ScrollTrigger is refreshed after 100 ms and on debounced window resize.

### CSS
`styles/main.css` (~1600 lines) — single flat file with no preprocessor. Custom properties (CSS variables) are defined on `:root` for colors, spacing, and typography.

### Static assets
`public/` contains the logo PNG and custom cursor SVGs (`cursor-default.svg`, `cursor-grab.svg`, `cursor-pointer.svg`).

### Build output
Vite splits the bundle into two manual chunks: `vendor` (gsap) and `three` (three.js npm package). Output goes to `dist/`.
