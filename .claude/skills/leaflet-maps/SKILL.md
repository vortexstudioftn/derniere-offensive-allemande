---
name: leaflet-history-maps
description: Patterns Leaflet pour les cartes scrollytelling du site Kaiserschlacht 1918. À utiliser DÈS qu'on touche à la carte, qu'on place un marker/polyline/popup, ou qu'on a besoin de coordonnées d'un lieu historique du front Ouest 1918. Inclut un fichier coordinates.json avec toutes les villes, QG, fronts par opération.
---

# Cartes Leaflet — Kaiserschlacht 1918

## 🚨 Règle absolue : ne JAMAIS inventer de coordonnées

Avant de placer quoi que ce soit sur la carte :
1. Lire `coordinates.json` (dans ce même dossier).
2. Si le lieu est dedans → l'utiliser, tel quel.
3. Si le lieu n'y est PAS → **demander à l'utilisateur**, ne pas deviner.
4. Si la donnée doit être ajoutée → la proposer au format du fichier et la committer dedans.

Format : `[latitude, longitude]` (ordre Leaflet — pas GeoJSON qui est inversé).

## Setup carte (dark, immersive, scroll-friendly)

```js
const map = L.map('map', {
  center: [49.5, 3.5],          // Picardie, centre des offensives
  zoom: 7,
  zoomControl: false,             // UI cachée pour l'immersion
  attributionControl: true,
  scrollWheelZoom: false,         // ❗ sinon le scroll page est bloqué
  doubleClickZoom: false,
  dragging: false,                // optionnel : carte non-manipulable
  keyboard: false,
});

// Base sombre, sans labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap, © CARTO',
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map);

// Labels par-dessus (lisibles même si on ajoute des overlays)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map);
```

## Fly-to par chapitre (au scroll)

```js
function flyToOperation(opKey) {
  const op = COORDS.operations[opKey];
  map.flyTo(op.view.center, op.view.zoom, {
    duration: 2.5,
    easeLinearity: 0.25,
  });
}
// Trigger via IntersectionObserver sur chaque section .chapter
```

## Marker custom (style du site : pastille rouge ou bleue)

```js
// Pas L.marker (icône bleue par défaut moche), TOUJOURS divIcon
function dot(color = '#c0392b', size = 14) {
  return L.divIcon({
    className: 'map-dot',
    html: `<span style="
      display:block;width:${size}px;height:${size}px;
      background:${color};border-radius:50%;
      box-shadow:0 0 0 2px rgba(0,0,0,.6), 0 0 12px ${color};
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

L.marker(COORDS.cities.amiens, { icon: dot('#c0392b') })
  .bindTooltip('Amiens', { className: 'map-label', direction: 'top' })
  .addTo(map);
```

CSS associé :
```css
.map-label {
  background: rgba(10,10,10,.85); color:#fff;
  border:1px solid #c0392b; padding:2px 8px;
  font: 11px/1.4 system-ui; letter-spacing:.06em;
  text-transform:uppercase;
}
```

## Front qui avance (polyline progressive)

```js
function animateFront(points, { color = '#c0392b', weight = 3, duration = 2000 } = {}) {
  const line = L.polyline([points[0]], { color, weight, opacity: 0.9 }).addTo(map);
  const stepMs = duration / (points.length - 1);
  let i = 1;
  const tick = () => {
    if (i >= points.length) return;
    line.addLatLng(points[i]);
    i++;
    setTimeout(tick, stepMs);
  };
  setTimeout(tick, stepMs);
  return line;
}

// Usage : à l'entrée du chapitre Michael
animateFront(COORDS.operations.michael.front_initial, { color: '#888' });
setTimeout(() => {
  animateFront(COORDS.operations.michael.front_final, { color: '#c0392b' });
}, 2200);
```

## Flèche de poussée (axis_arrow)

Utilise `axis_arrow` (2 points : départ → objectif) avec un Polyline + dashArray pour l'effet militaire :
```js
function thrustArrow(from, to, color = '#c0392b') {
  return L.polyline([from, to], {
    color, weight: 4, opacity: 0.85,
    dashArray: '8 6',
  }).addTo(map);
}
```
Pour la pointe de flèche : ajouter un `divIcon` rotated au point `to` (rotation = atan2(dy,dx)).

## Mouvement longue distance animé (Brest-Litovsk → Spa, US → France)

Utilise les entrées `movements` du JSON. Idem `animateFront` avec 2 points + dashArray animé (CSS `stroke-dashoffset`).

## Anti-patterns

- ❌ **JAMAIS inventer de coords** (voir règle absolue plus haut).
- ❌ Pas de `L.marker` par défaut (icône bleue Leaflet = casse le design).
- ❌ Pas de tiles claires.
- ❌ Pas de `scrollWheelZoom: true` (bloque le scroll de la page).
- ❌ Pas de popups (cassent le flow scroll) → utiliser tooltips ou panels HTML overlay.
- ❌ Pas de plugins lourds (Leaflet.markercluster, etc.) — vanilla Leaflet suffit.

## Pour vérifier visuellement

Si Playwright MCP est branché : après chaque modif carte, screenshot localhost:8000 à la section concernée et vérifier que les marqueurs/lignes sont bien sur les bonnes villes. Sans ça, c'est du code en aveugle.
