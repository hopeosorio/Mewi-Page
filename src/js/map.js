import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LOCATIONS = [
  {
    name: 'Centro Histórico',
    address: 'Plaza Principal 12',
    lat: 21.156844319529093,
    lng: -100.93434023194997,
    href: 'https://maps.app.goo.gl/zGGXzkGmdAJRrMRg9'
  },
  {
    name: 'Plaza Paseo Dolores',
    address: 'Av. Nte. 65, Margaritas',
    lat: 21.160151911460005,
    lng: -100.92913339946993,
    href: 'https://maps.app.goo.gl/uy1fEBBejmPX3dzY9',
  }
];

const CENTER = [21.1585, -100.9317];

function makeIcon() {
  // PNG original 1557×1206 → ratio 1.29:1
  return L.icon({
    iconUrl: '/brand/Icono-Tapi.png',
    iconSize: [46, 36],
    iconAnchor: [23, 36],
    popupAnchor: [0, -40],
  });
}

function initMap() {
  const container = document.getElementById('map-container');
  if (!container) return;

  const map = L.map('map-container', {
    center: CENTER,
    zoom: 15,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false,
    dragging: true,
  });

  // CartoDB Positron — estilo limpio beige/cream, sin API key
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // Atribución mínima
  L.control.attribution({ position: 'bottomright', prefix: false })
    .addAttribution('© <a href="https://carto.com">CARTO</a>')
    .addTo(map);

  // Pins + popups
  LOCATIONS.forEach((loc, i) => {
    const marker = L.marker([loc.lat, loc.lng], { icon: makeIcon() }).addTo(map);

    marker.bindPopup(
      `<div class="mewi-popup">
         <strong>${loc.name}</strong>
         <span>${loc.address}</span>
         <a href="${loc.href}" target="_blank" rel="noopener">Cómo llegar →</a>
       </div>`,
      { maxWidth: 200, className: 'mewi-popup-wrap' }
    );

    marker.on('mouseover', () => marker.openPopup());

    // Sincroniza con los location-items del panel
    const item = document.querySelectorAll('.location-item')[i];
    if (item) {
      item.addEventListener('mouseenter', () => {
        marker.openPopup();
        map.panTo([loc.lat, loc.lng], { animate: true, duration: 0.4 });
      });
      item.addEventListener('mouseleave', () => marker.closePopup());
    }
  });

  // Zoom por scroll/gestos deshabilitado permanentemente en desktop

  // Corrige tamaño y centra ambas sucursales al hacerse visible
  const bounds = L.latLngBounds(LOCATIONS.map(loc => [loc.lat, loc.lng]));
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [60, 80] });
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
