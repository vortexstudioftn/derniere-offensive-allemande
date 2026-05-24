/* ============================================================
   CARTE FRIEDENSTURM — 15 juillet 1918
   + contre-offensive Villers-Cotterêts 18 juillet 1918
   Coordonnées vérifiées OSM Nominatim + Wikipedia (mai 2026)
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-friedensturm');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-friedensturm', {
      center: [49.18, 3.55],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Saillant allemand de la Marne (état au 15 juillet)
    MapFX.areaPolygon(
      [
        [49.3838, 3.3276],  // Soissons
        [49.0839, 3.2930],  // Belleau
        [49.0457, 3.4027],  // Château-Thierry
        [49.0746, 3.6384],  // Dormans
        [49.0426, 3.9529],  // Épernay
        [49.2578, 4.0319],  // Reims
        [49.3838, 3.3276],  // retour Soissons
      ],
      { fillOpacity: 0.18 }
    ).addTo(map).bindTooltip('Saillant allemand de la Marne · 15 juillet 1918', {
      direction: 'top', className: 'map-tooltip',
    });

    // Attaque ouest de Reims — 15 juillet
    MapFX.animatedPolyline(
      [[49.2578, 4.0319], [49.1500, 3.8500], [49.0746, 3.6384]],
      { color: '#c0392b', weight: 6, duration: 1.8, delay: 0.4 }
    ).addTo(map);

    // Attaque est de Reims (Champagne) — Gouraud défend
    MapFX.animatedPolyline(
      [[49.2578, 4.0319], [49.1373, 4.3660], [49.1308, 4.5318]],
      { color: '#c0392b', weight: 5, duration: 1.6, delay: 0.7 }
    ).addTo(map);

    // Contre-offensive 18 juillet (Mangin / 225 chars FT) — bleu, dramatique
    MapFX.animatedPolyline(
      [[49.2549, 3.0909], [49.3072, 3.3000], [49.3838, 3.3276]],
      { color: '#3a6b8c', weight: 7, duration: 2.4, delay: 2.0 }
    ).addTo(map).bindTooltip('18 juillet — 225 chars Renault FT (Mangin)', {
      direction: 'top', className: 'map-tooltip',
    });

    [
      { name: 'Reims',              coord: [49.2578, 4.0319], note: 'Verrou allié — attaqué des deux côtés',     side: 'allied', big: true },
      { name: 'Château-Thierry',    coord: [49.0457, 3.4027], note: 'Pointe sud du saillant',                    side: 'german' },
      { name: 'Dormans',            coord: [49.0746, 3.6384], note: 'Traversée de la Marne',                     side: 'german' },
      { name: 'Épernay',            coord: [49.0426, 3.9529], note: 'Menacée — axe Marne',                       side: 'german' },
      { name: 'Villers-Cotterêts',  coord: [49.2549, 3.0909], note: '18 juillet — attaque surprise alliée',     side: 'allied', big: true },
      { name: 'Soissons',           coord: [49.3838, 3.3276], note: 'Objectif de la contre-attaque',             side: 'allied' },
      { name: 'Mourmelon',          coord: [49.1373, 4.3660], note: 'Gouraud — défense élastique en Champagne', side: 'allied' },
    ].forEach((c) => {
      MapFX.pulseMarker(c.coord, {
        color: c.side === 'german' ? '#c0392b' : '#3a6b8c',
        size: c.big ? 18 : 14,
        label: `<strong>${c.name}</strong><br>${c.note}`,
      }).addTo(map);
      MapFX.cityLabel(c.coord, c.name).addTo(map);
    });

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <span><i style="background:#c0392b"></i> Friedensturm · 15 juillet</span>
        <span><i style="background:#3a6b8c"></i> Contre-offensive · 18 juillet</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
