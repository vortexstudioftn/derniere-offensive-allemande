/* ============================================================
   CARTE OPÉRATION GNEISENAU — 9 - 13 juin 1918
   Montdidier - Noyon · arrêté par Mangin
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-gneisenau');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-gneisenau', {
      center: [49.55, 2.8],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    L.polyline(
      [[49.6489, 2.5694], [49.5832, 3.0001]],
      { color: '#ffffff', weight: 2, opacity: 0.4, dashArray: '4 6' }
    ).addTo(map);

    // Attaque allemande (limitée)
    [
      [[49.6, 2.93], [49.6, 2.75], [49.6, 2.6]],
      [[49.55, 2.95], [49.55, 2.78], [49.55, 2.65]],
    ].forEach((p, i) => {
      MapFX.animatedPolyline(p, {
        color: '#c0392b', weight: 5, duration: 1.6, delay: 0.3 + i * 0.25,
      }).addTo(map);
    });

    // Contre-attaque Mangin (bleue, dashed) — délai pour effet "puis ça réplique"
    MapFX.animatedPolyline(
      [[49.45, 2.5], [49.5, 2.65], [49.55, 2.78]],
      { color: '#3a6b8c', weight: 5, duration: 1.6, delay: 1.5 }
    ).addTo(map);

    [
      { name: 'Montdidier', coord: [49.6489, 2.5694], note: 'Aile ouest allemande',          side: 'german' },
      { name: 'Noyon',      coord: [49.5832, 3.0001], note: 'Point de départ allemand',      side: 'german' },
      { name: 'Compiègne',  coord: [49.4179, 2.8261], note: 'QG Mangin · contre-attaque',    side: 'allied', big: true },
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
