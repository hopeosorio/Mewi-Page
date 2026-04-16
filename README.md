# Mewi — Landing Page

Landing page oficial de Mewi, marca de bubble tea con presencia en Dolores Hidalgo Guanajuato, México. El sitio presenta la identidad de la marca, el menú de productos, el equipo, testimonios de clientes, galería de comunidad y ubicación de sucursales.

---

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| Vite | 8.x | Bundler y servidor de desarrollo |
| GSAP | 3.x | Animaciones, ScrollTrigger, Observer |
| Lenis | 1.3.x | Smooth scroll |
| Leaflet | 1.9.x | Mapa interactivo de sucursales |

No usa frameworks de UI. Todo el frontend es HTML, CSS y JavaScript vanilla modular.

---

## Estructura del proyecto

```
Mewi-Page/
├── index.html               # Documento principal (único HTML)
├── vite.config.js           # Configuración de Vite
├── package.json
│
├── src/
│   ├── main.js              # Entry point: Lenis, GSAP, scrollbar, nav, animaciones
│   ├── styles/
│   │   └── main.css         # Estilos globales, secciones, animaciones CSS, responsive
│   ├── js/
│   │   └── map.js           # Mapa Leaflet con marcadores de sucursales
│   ├── components/
│   │   ├── Favoritos.js     # Render dinámico del carrusel de productos
│   │   └── Testimonios.js   # Render dinámico de la sección de testimonios
│   └── data/
│       ├── products.js      # Catálogo de productos (nombre, descripción, imagen)
│       └── testimonials.js  # Datos de reseñas de clientes
│
└── public/
    ├── brand/
    │   ├── Logo Mewi.png    # Logo principal
    │   ├── Icono-Tapi.png   # Icono marcador del mapa
    │   └── Esfera5.webp     # Asset decorativo del hero
    ├── cursors/
    │   ├── cursor-default.svg   # Cursor — flecha
    │   ├── cursor-pointer.svg   # Cursor — mano
    │   └── cursor-grab.svg      # Cursor — agarre (scrollbar/mapa)
    ├── images/
    │   ├── comunidad/       # Fotos de clientes para la galería cinética
    │   ├── equipo/          # Fotos del equipo
    │   ├── productos/       # Imágenes de productos para el marquee y carrusel
    │   └── testimonios/     # Fotos de autores de reseñas
    └── docs/
        └── menu.pdf         # Menú descargable enlazado desde la sección Favoritos
```

---

## Secciones de la página

| Sección | ID / Clase | Descripción |
|---|---|---|
| Hero | `#hero` | Portada con título animado, botón CTA e indicador de scroll |
| Marquee | `.marquee-section` | Banda infinita con fotos de producto y palabras clave |
| Favoritos | `#favoritos` | Carrusel horizontal de productos con swipe |
| Nosotros / Manifiesto | `#manifiesto` | Historia y filosofía de la marca con animación de palabras |
| Proceso | `.proceso` | Story de 4 paneles con scroll-pin que explica la elaboración |
| Equipo | `.equipo` | Collage fotográfico del equipo con estadísticas |
| Valores | `#valores` | Lista de valores con animación de filas |
| Comunidad | `#ustedes` | Galería cinética de 3 filas con fotos de clientes |
| Testimonios | `.testimonios` | Grid bento con tarjetas de reseñas |
| Sucursales | `#location` | Mapa Leaflet con panel de información por sucursal |
| Redes sociales | `.social` | Cards de Instagram, Facebook y Google Maps |
| Footer | `footer` | Links, perlas animadas y créditos |

---

## Características técnicas

### Smooth scroll
Lenis maneja el scroll en modo documento (no wrapper). GSAP ScrollTrigger se actualiza mediante el evento `scroll` de Lenis para mantener sincronía perfecta entre animaciones y posición de scroll.

### Scrollbar personalizado
Overlay fijo (`position: fixed`, `z-index: 2147483647`) con track transparente y thumb arrastrable. El drag calcula la posición mediante `lenis.animatedScroll` y `lenis.limit`, evitando el uso de `window.scrollY` que es asíncrono. Se inicializa con doble `requestAnimationFrame` para esperar a que Lenis calcule el límite antes del primer render del thumb.

### Cursores personalizados
Tres SVGs en `public/`: default (flecha), pointer (mano) y grab (agarre para scrollbar y mapa). Se aplican con regla `* { cursor: url(...) !important }`. Los elementos con `backdrop-filter` tienen `isolation: isolate` para evitar conflictos de capa de compositor que sobreescriben el cursor.

### Galería cinética
Tres filas de fotos con animación CSS pura (`@keyframes scrollLeft / scrollRight`) a velocidades distintas (40s, 45s, 55s). Las animaciones se pausan al hacer hover. El efecto de skew durante el scroll se aplica con GSAP ScrollTrigger sobre el contenedor completo.

### Mapa interactivo
Leaflet con tiles de OpenStreetMap y marcadores personalizados con el ícono de la marca. Panel lateral que muestra dirección, horario y servicios de la sucursal seleccionada.

---

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo con HMR
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

El servidor de desarrollo corre en `http://localhost:3000` por defecto.

---

## Despliegue

El proyecto genera un build estático en `dist/` con `npm run build`. Compatible con cualquier hosting estático (Vercel, Netlify, GitHub Pages, servidor Nginx).

Para Vercel se recomienda un `vercel.json` con rewrite a `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
