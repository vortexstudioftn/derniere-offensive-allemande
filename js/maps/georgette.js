/* ============================================================
   CARTE OPÉRATION GEORGETTE — 9 - 29 avril 1918 · Flandres
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-georgette');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-georgette', {
      center: [50.69, 2.85],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Front initial avant attaque
    L.polyline(
      [[50.8503, 2.8853], [50.6852, 2.8819], [50.5294, 2.6403]],
      { color: '#ffffff', weight: 2, opacity: 0.4, dashArray: '4 6' }
    ).addTo(map);

    // Attaques sur la Lys (2 axes)
    [
      [[50.78, 3.10], [50.72, 2.92], [50.68, 2.78]],
      [[50.55, 3.05], [50.55, 2.85], [50.58, 2.62]],
    ].forEach((p, i) => {
      MapFX.animatedPolyline(p, {
        color: '#c0392b', weight: 5, duration: 1.8, delay: 0.4 + i * 0.3,
      }).addTo(map);
    });

    [
      { name: 'Ypres',        coord: [50.8503, 2.8853], note: 'Verrou britannique — tient',     side: 'allied', big: true },
      { name: 'Armentières',  coord: [50.6852, 2.8819], note: 'Tombée le 11 avril 1918',         side: 'german' },
      { name: 'La Bassée',    coord: [50.5294, 2.6403], note: 'Aile sud allemande',              side: 'german' },
      { name: 'Hazebrouck',   coord: [50.7269, 2.5404], note: 'Objectif final non atteint',      side: 'allied' },
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
        <span><i style="background:#3a6b8c"></i> Positions alliées</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
