---
name: leaflet-history-maps
description: Patterns Leaflet pour les cartes scrollytelling du site Kaiserschlacht 1918. À utiliser DÈS qu'on touche à la carte, qu'on place un marker/polyline/popup, ou qu'on a besoin de coordonnées d'un lieu historique du front Ouest 1918. Inclut un fichier coordinates.json avec toutes les villes, QG, fronts par opération.
---

# Cartes Leaflet — Kaiserschlacht 1918

## Règle absolue : ne JAMAIS inventer de coordonnées

Avant de placer quoi que ce soit sur la carte :
1. Lire `coordinates.json` (racine du projet).
2. Si le lieu est dedans -> l'utiliser, tel quel.
3. Si le lieu n'y est PAS -> **demander a l'utilisateur**, ne pas deviner.
4. Si la donnee doit etre ajoutee -> la proposer au format du fichier et la committer dedans.
5. Toutes les coordonnees sont verifiees via OSM Nominatim + Wikipedia (mai 2026).

Format : `[latitude, longitude]` (ordre Leaflet -- pas GeoJSON qui est inverse).

## API MapFX (js/maps/_map-helpers.js)

Toutes les cartes utilisent le namespace `window.MapFX`. Ne pas reinventer les helpers.

```js
// Tiles sombres (CARTO dark nolabels + labels)
MapFX.darkTiles().addTo(map);

// Polyline animee avec fleche (stroke-dashoffset CSS)
MapFX.animatedPolyline(latlngs, {
  color: '#c0392b',  // rouge allemand ou '#3a6b8c' bleu allie
  weight: 5,
  duration: 1.8,     // secondes
  delay: 0.4,        // delai avant animation
  arrow: true,       // pointe de fleche auto
  arrowSize: 12,
}).addTo(map);

// Marqueur pulsant (halo anime)
MapFX.pulseMarker([49.895, 2.302], {
  color: '#c0392b',
  size: 18,          // diametre halo
  label: '<strong>Amiens</strong><br>Noeud ferroviaire',
}).addTo(map);

// Label texte permanent
MapFX.cityLabel([49.895, 2.302], 'Amiens').addTo(map);

// Polygone semi-transparent (zone d'avance)
MapFX.areaPolygon(latlngs, {
  color: '#c0392b',
  fillOpacity: 0.18,
  weight: 2,
}).addTo(map);
```

## Setup carte (pattern standard)

```js
const map = L.map('map-id', {
  center: [49.85, 2.95],
  zoom: 9,
  zoomControl: false,
  scrollWheelZoom: false,   // sinon le scroll page est bloque
  dragging: false,
  doubleClickZoom: false,
  touchZoom: false,
  keyboard: false,
  zoomSnap: 0.25,
});
MapFX.darkTiles().addTo(map);
```

## Couleurs

- Allemand / offensif : `#c0392b` (rouge sang, var --accent)
- Allie / defensif : `#3a6b8c` (bleu, var --allied)
- Front initial : `#ffffff` opacity 0.5, dashArray '4 6'
- Front final : `#c0392b` opacity 0.35, dashArray '6 4'

## Structure des fichiers carte

```
js/maps/
  _map-helpers.js     # MapFX namespace (NE PAS MODIFIER sauf ajout de helper)
  context.js          # Europe 1918, flux de troupes (ecoute step:enter)
  michael.js          # Operation Michael
  georgette.js        # Operation Georgette
  blucher.js          # Operation Blucher-Yorck
  gneisenau.js        # Operation Gneisenau
  friedensturm.js     # Friedensturm + contre-offensive Mangin
  timeline.js         # Timeline integration scroll
```

Chaque carte s'initialise dans un IIFE auto-contenu, ecoute `DOMContentLoaded`,
et verifie `container && L && MapFX` avant de demarrer.

## Pattern d'une carte de bataille

```js
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-xxx');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;
    const map = L.map('map-xxx', { /* options standard */ });
    MapFX.darkTiles().addTo(map);

    // 1. Front initial (blanc tirete)
    L.polyline(coords, { color: '#ffffff', weight: 2, opacity: 0.5, dashArray: '4 6' }).addTo(map);

    // 2. Fleches d'attaque (animees, rouges, stagger delay)
    axes.forEach((path, i) => {
      MapFX.animatedPolyline(path, {
        color: '#c0392b', weight: 5, duration: 1.8, delay: 0.4 + i * 0.3,
      }).addTo(map);
    });

    // 3. Marqueurs villes
    cities.forEach((c) => {
      MapFX.pulseMarker(c.coord, { color: ..., label: ... }).addTo(map);
      MapFX.cityLabel(c.coord, c.name).addTo(map);
    });

    // 4. Legende
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () { ... };
    legend.addTo(map);
  });
})();
```

## Anti-patterns

- JAMAIS inventer de coords (voir regle absolue plus haut).
- Pas de `L.marker` par defaut (icone bleue Leaflet = casse le design) -> MapFX.pulseMarker.
- Pas de tiles claires.
- Pas de `scrollWheelZoom: true` (bloque le scroll de la page).
- Pas de popups (cassent le flow scroll) -> utiliser tooltips ou panels HTML overlay.
- Pas de plugins lourds (Leaflet.markercluster, etc.) -- vanilla Leaflet suffit.

## Pour verifier visuellement

Playwright MCP est configure : apres chaque modif carte, naviguer sur localhost et
screenshot la section concernee pour verifier que les marqueurs/lignes sont sur les bonnes villes.
Port par defaut : 8765 (npx http-server).
