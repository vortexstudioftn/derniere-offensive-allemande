/* ============================================================
   CARTE CONTEXTE — Europe 1918, flux de troupes
   - Divisions allemandes : Russie → Front Ouest (rouge)
   - Renforts US : Atlantique → ports français (bleu)
   - Animées au scroll selon les steps "context-1" à "context-4"
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-context');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-context', {
      center: [49, 2],
      zoom: 4,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Coordonnées clés
    const POINTS = {
      brest_litovsk: [52.0976, 23.7341],
      front_ouest: [49.5, 3.0],
      paris: [48.8566, 2.3522],
      brest_fr: [48.39, -4.49],
      saint_nazaire: [47.27, -2.21],
      bordeaux: [44.84, -0.58],
      new_york: [40.71, -74.0],
      spa: [50.49, 5.86],
    };

    // Layers groups — on les ajoute/retire selon le scroll
    const germanArrows = L.layerGroup();
    const usArrows = L.layerGroup();
    const ludendorffLayer = L.layerGroup();

    // --- Allemand : Brest-Litovsk → front Ouest ---
    MapFX.animatedPolyline(
      [POINTS.brest_litovsk, [52, 18], [51, 8], POINTS.front_ouest],
      { color: '#c0392b', weight: 5, duration: 2, delay: 0.3 }
    ).addTo(germanArrows);
    MapFX.pulseMarker(POINTS.brest_litovsk, {
      color: '#c0392b', size: 16, label: '<strong>Brest-Litovsk</strong><br>Traité du 3 mars 1918',
    }).addTo(germanArrows);
    MapFX.pulseMarker(POINTS.front_ouest, {
      color: '#c0392b', size: 18, label: '<strong>Front Ouest</strong><br>+50 divisions transférées',
    }).addTo(germanArrows);
    MapFX.cityLabel(POINTS.brest_litovsk, 'BREST-LITOVSK').addTo(germanArrows);
    MapFX.cityLabel(POINTS.front_ouest, 'FRONT OUEST').addTo(germanArrows);

    // --- US : New York → ports français ---
    [
      [POINTS.new_york, [47, -40], [47, -10], POINTS.brest_fr],
      [POINTS.new_york, [45, -40], [45, -10], POINTS.saint_nazaire],
    ].forEach((path, i) => {
      MapFX.animatedPolyline(path, {
        color: '#3a6b8c', weight: 4, duration: 2.5, delay: 0.4 + i * 0.3,
      }).addTo(usArrows);
    });
    [POINTS.brest_fr, POINTS.saint_nazaire, POINTS.bordeaux].forEach((p) => {
      MapFX.pulseMarker(p, { color: '#3a6b8c', size: 12 }).addTo(usArrows);
    });
    MapFX.cityLabel(POINTS.new_york, 'NEW YORK').addTo(usArrows);
    MapFX.cityLabel(POINTS.brest_fr, 'BREST').addTo(usArrows);

    // --- QG Ludendorff (Spa) ---
    MapFX.pulseMarker(POINTS.spa, {
      color: '#c0392b', size: 14,
      label: '<strong>Spa (Belgique)</strong><br>QG suprême allemand · Ludendorff',
    }).addTo(ludendorffLayer);
    MapFX.cityLabel(POINTS.spa, 'QG SPA').addTo(ludendorffLayer);

    // Écoute le scroll des steps
    document.addEventListener('step:enter', (e) => {
      const id = e.detail.id;
      [germanArrows, usArrows, ludendorffLayer].forEach((l) => map.removeLayer(l));

      switch (id) {
        case 'context-1':
          germanArrows.addTo(map);
          map.flyTo([51, 16], 4.5, { duration: 1.5 });
          break;
        case 'context-2':
          germanArrows.addTo(map);
          usArrows.addTo(map);
          map.flyTo([46, -15], 3.5, { duration: 1.5 });
          break;
        case 'context-3':
          germanArrows.addTo(map);
          usArrows.addTo(map);
          ludendorffLayer.addTo(map);
          map.flyTo([50, 5], 5, { duration: 1.5 });
          break;
        case 'context-4':
          germanArrows.addTo(map);
          usArrows.addTo(map);
          ludendorffLayer.addTo(map);
          map.flyTo([49.5, 3], 5.5, { duration: 1.5 });
          break;
      }
    });

    // État initial
    germanArrows.addTo(map);

    // Légende
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <span><i style="background:#c0392b"></i> Divisions allemandes (Est → Ouest)</span>
        <span><i style="background:#3a6b8c"></i> Renforts US (Atlantique → France)</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
