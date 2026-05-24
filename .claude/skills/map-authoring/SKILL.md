---
name: map-authoring
description: Comment écrire / modifier les cartes Leaflet de ce site. Conventions de couleur, API MapFX, gestion des layers, arrowheads. À charger dès qu'on touche à un fichier dans js/maps/.
---

# Authoring de cartes — ExposerHistoire

## API MapFX (helpers du projet)

Toutes définies dans `js/maps/_map-helpers.js`, exposées sur `window.MapFX`.

### `MapFX.darkTiles()`
Retourne un `L.tileLayer` OSM filtré sombre (via CSS sur `.leaflet-tile-pane`). À utiliser au début de toute carte :
```js
MapFX.darkTiles().addTo(map);
```

### `MapFX.animatedPolyline(latlngs, opts)`
Polyline animée (effet "stroke draw" via SVG `stroke-dashoffset`) + **pointe de flèche** triangulaire orientée par défaut.

```js
MapFX.animatedPolyline(
  [[49.95, 3.55], [49.93, 2.85]],
  {
    color: '#c0392b',    // voir conventions de couleur
    weight: 5,
    duration: 1.8,       // sec, durée du tracé
    delay: 0.4,          // sec, retard avant de commencer
    arrow: true,         // pointe (true par défaut)
    arrowSize: 16,       // px
  }
).addTo(map);
```

**Retour** : un `L.layerGroup` qui contient la polyline + l'arrowhead. Compatible avec `.addTo(map)`, `.bindTooltip()`, `.remove()`, `.clearLayers()`.

### `MapFX.pulseMarker(latlng, opts)`
Marqueur avec halo CSS animé en pulsation.

```js
MapFX.pulseMarker([49.85, 3.29], {
  color: '#c0392b',
  size: 14,                                         // px, 18 pour ville importante
  label: '<strong>Saint-Quentin</strong><br>...',   // tooltip HTML
}).addTo(map);
```

### `MapFX.cityLabel(latlng, name, opts)`
Étiquette texte permanente (sans interaction), positionnée au-dessus du point. Utiliser en duo avec `pulseMarker`.

```js
MapFX.pulseMarker(coord, {...}).addTo(map);
MapFX.cityLabel(coord, 'AMIENS').addTo(map);  // toujours en MAJUSCULES
```

### `MapFX.areaPolygon(latlngs, opts)`
Polygone semi-transparent pour les "zones d'avance" (ex: saillant de la Marne).

```js
MapFX.areaPolygon([
  [49.45, 3.32], [49.05, 3.40], [49.0, 3.80], ...
], { fillOpacity: 0.18 }).addTo(map);
```

## Conventions de couleur

| Acteur | Hex | Variable CSS | Usage |
|---|---|---|---|
| Allemand / Offensive | `#c0392b` | `--accent` | Flèches d'attaque, marqueurs allemands, zones d'avance |
| Allié / Contre-attaque | `#3a6b8c` | `--allied` | Contre-offensives, positions défensives |
| Neutre / Front | `#e8e6e1` | `--text` | Lignes de front (état actuel) |
| Faded / Front avant | `#ffffff` (opacity 0.4, dashed) | — | Front avant l'attaque (référence) |

**Jamais** d'autres couleurs sans raison historique. Tout flou visuel = perte d'impact.

## Config standard d'une carte de présentation

Une carte de ce site n'est **pas interactive** (pas de zoom/drag user) — c'est une visualisation. Toujours :

```js
const map = L.map('map-xxx', {
  center: [lat, lng],
  zoom: 8,
  zoomControl: false,
  attributionControl: true,
  scrollWheelZoom: false,    // ← capterait le scroll de la page
  dragging: false,
  doubleClickZoom: false,
  touchZoom: false,
  keyboard: false,            // ← le clavier est utilisé par PresentationController
  zoomSnap: 0.25,             // permet flyTo à des zooms fractionnaires
});
```

## Légende — `L.control` custom

Ne pas mettre la légende en HTML séparé — utiliser `L.control` pour qu'elle soit positionnée par Leaflet (compatible avec le z-index du tile-pane).

```js
const legend = L.control({ position: 'bottomleft' });   // ← TOUJOURS bottomleft
                                                          //    (le texte est à droite)
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'map-legend');
  div.innerHTML = `
    <span><i style="background:#c0392b"></i> Offensive allemande</span>
    <span><i style="background:#3a6b8c"></i> Positions alliées</span>
  `;
  return div;
};
legend.addTo(map);
```

## Ajouter une nouvelle carte — checklist

1. **Créer** `js/maps/NOM.js` en partant de `js/maps/michael.js` comme template
2. **Référencer** dans `index.html` après les autres cartes :
   ```html
   <script src="js/maps/NOM.js"></script>
   ```
3. **Container HTML** dans la section appropriée :
   ```html
   <div id="map-NOM" class="map" aria-label="..."></div>
   ```
4. **Si scrollytelling** : ajouter `data-step="NOM-1"`, `data-step="NOM-2"` sur les `.step` et écouter `step:enter` dans le JS de la carte
5. **Si clavier** : déclarer dans `SECTIONS` de `js/presentation.js` avec `stepCount` correct

## Coordonnées précises (en attente de calibrage)

Les positions actuelles sont des **estimations à l'œil** depuis OSM. Pour la version finale, il faudrait :
- **Mémoire des Hommes (SHD)** — JMO avec carroyage des positions
- **NLS Maps** — cartes WWI géoréférencées (https://maps.nls.uk/)
- **Trench Map Atlas** — Imperial War Museum

Villes clés validées :
```js
const CITIES = {
  "Amiens":            [49.8941, 2.2958],
  "Saint-Quentin":     [49.8480, 3.2876],
  "Arras":             [50.2920, 2.7806],
  "Ypres":             [50.8503, 2.8854],
  "Reims":             [49.2583, 4.0317],
  "Château-Thierry":   [49.0469, 3.3997],
  "Villers-Cotterêts": [49.2533, 3.0907],
  "Compiègne":         [49.4179, 2.8262],
  "Paris":             [48.8566, 2.3522],
  "Verdun":            [49.1610, 5.3850],
};
```

## Anti-patterns

- ❌ **Pas de `L.polyline()` brute** — toujours `MapFX.animatedPolyline()` pour cohérence visuelle (animation + arrowhead)
- ❌ **Pas de `L.marker()` par défaut** (l'icône bleue par défaut casse l'esthétique) — `MapFX.pulseMarker()`
- ❌ **Pas de `interactive: true` sur les `cityLabel`** — ils ne doivent pas voler le hover des markers
- ❌ **Pas oublier `clearLayers()`** sur les layerGroups dynamiques avant de re-render (cf. `timeline.js`)
- ❌ **Pas de tile fournisseur payant** — OSM + filtre CSS suffit, et reste online gratuit pour la prod
- ❌ **Pas de `map.invalidateSize()` au chargement** sauf si on change la taille du container après — sinon flash blanc
