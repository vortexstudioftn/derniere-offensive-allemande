/* ============================================================
   CARTE OPÉRATION GNEISENAU — 9 - 13 juin 1918
   Montdidier - Noyon · arrêté par Mangin
   Coordonnées vérifiées OSM Nominatim + Wikipedia (mai 2026)
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-gneisenau');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-gneisenau', {
      center: [49.55, 2.78],
      zoom: 10,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Front initial (Montdidier → Noyon via Ressons)
    L.polyline(
      [
        [49.6486, 2.5708],  // Montdidier
        [49.5394, 2.7448],  // Ressons-sur-Matz
        [49.5107, 2.9231],  // Ribécourt
        [49.5806, 3.0000],  // Noyon
      ],
      { color: '#ffffff', weight: 2, opacity: 0.5, dashArray: '4 6' }
    ).addTo(map);

    // Attaque allemande (2 axes)
    MapFX.animatedPolyline(
      [[49.5806, 3.0000], [49.5394, 2.7448], [49.5107, 2.9231]],
      { color: '#c0392b', weight: 5, duration: 1.6, delay: 0.3 }
    ).addTo(map);

    MapFX.animatedPolyline(
      [[49.6486, 2.5708], [49.5394, 2.7448]],
      { color: '#c0392b', weight: 5, duration: 1.4, delay: 0.55 }
    ).addTo(map);

    // Contre-attaque Mangin (11 juin) — bleue, délai plus long
    MapFX.animatedPolyline(
      [[49.4179, 2.8261], [49.5107, 2.9231], [49.5394, 2.7448]],
      { color: '#3a6b8c', weight: 5, duration: 1.6, delay: 1.5 }
    ).addTo(map);

    [
      { name: 'Montdidier',       coord: [49.6486, 2.5708], note: 'Aile ouest allemande',              side: 'german' },
      { name: 'Noyon',            coord: [49.5806, 3.0000], note: 'Point de départ allemand',           side: 'german' },
      { name: 'Ressons-sur-Matz', coord: [49.5394, 2.7448], note: 'Centre de l\'attaque',              side: 'german' },
      { name: 'Ribécourt',        coord: [49.5107, 2.9231], note: 'Secteur est',                       side: 'german' },
      { name: 'Compiègne',        coord: [49.4179, 2.8261], note: 'Mangin · contre-attaque du 11 juin', side: 'allied', big: true },
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
        <span><i style="background:#c0392b"></i> Attaque allemande</span>
        <span><i style="background:#3a6b8c"></i> Contre-attaque Mangin</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
