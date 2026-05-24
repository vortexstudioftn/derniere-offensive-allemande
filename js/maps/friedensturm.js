/* ============================================================
   CARTE FRIEDENSTURM — 15 juillet 1918
   + contre-offensive Villers-Cotterêts 18 juillet 1918
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-friedensturm');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-friedensturm', {
      center: [49.18, 3.65],
      zoom: 8,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Saillant allemand de la Marne (état au 15 juillet)
    MapFX.areaPolygon(
      [[49.45, 3.32], [49.05, 3.40], [49.0, 3.80], [49.05, 4.10], [49.40, 4.20], [49.45, 3.32]],
      { fillOpacity: 0.18 }
    ).addTo(map).bindTooltip('Saillant allemand de la Marne · 15 juillet 1918', {
      direction: 'top', className: 'map-tooltip',
    });

    // Attaques Friedensturm — 15 juillet (rouge)
    [
      [[49.42, 4.25], [49.36, 4.15], [49.32, 4.05]],  // ouest de Reims
      [[49.15, 4.45], [49.18, 4.30], [49.22, 4.18]],  // est de Reims (Champagne)
    ].forEach((p, i) => {
      MapFX.animatedPolyline(p, {
        color: '#c0392b', weight: 6, duration: 1.8, delay: 0.4 + i * 0.3,
      }).addTo(map);
    });

    // Contre-offensive 18 juillet (Mangin / chars FT) — bleu, plus tard, plus dramatique
    MapFX.animatedPolyline(
      [[49.27, 3.05], [49.30, 3.30], [49.34, 3.55], [49.30, 3.80]],
      { color: '#3a6b8c', weight: 7, duration: 2.4, delay: 2.0 }
    ).addTo(map).bindTooltip('18 juillet — 225 chars Renault FT (Mangin)', {
      direction: 'top', className: 'map-tooltip',
    });

    [
      { name: 'Reims',             coord: [49.2583, 4.0317], note: 'Verrou allié — à encercler',                 side: 'allied', big: true },
      { name: 'Château-Thierry',   coord: [49.0411, 3.4006], note: 'Pointe sud du saillant',                     side: 'german' },
      { name: 'Villers-Cotterêts', coord: [49.2553, 3.0903], note: '18 juillet — attaque surprise alliée',      side: 'allied', big: true },
      { name: 'Soissons',          coord: [49.3815, 3.3236], note: 'Reprise par les Alliés',                     side: 'allied' },
      { name: 'Châlons',           coord: [48.9569, 4.3636], note: 'QG Gouraud — défense élastique',             side: 'allied' },
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
