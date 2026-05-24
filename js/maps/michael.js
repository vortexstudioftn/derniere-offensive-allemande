/* ============================================================
   CARTE OPÉRATION MICHAEL — 21 mars - 5 avril 1918
   Front Picardie · Saint-Quentin → Amiens
   Utilise les helpers MapFX (flèches animées, marqueurs pulsants).
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-michael');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-michael', {
      center: [49.85, 2.95],
      zoom: 8,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
      attributionControl: true,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Front initial 21 mars 1918 (avant l'attaque)
    L.polyline(
      [[50.2910, 2.7778], [49.8489, 3.2876], [49.6614, 3.3672]],
      { color: '#ffffff', weight: 2, opacity: 0.4, dashArray: '4 6' }
    ).addTo(map);

    // Flèches d'attaque allemandes — se dessinent après ~400ms
    [
      [[50.0, 3.55], [49.95, 3.20], [49.93, 2.85]],
      [[49.85, 3.5], [49.7, 3.0], [49.6, 2.6]],
      [[49.5, 3.4], [49.45, 3.0], [49.4, 2.7]],
    ].forEach((path, i) => {
      MapFX.animatedPolyline(path, {
        color: '#c0392b',
        weight: 5,
        duration: 1.8,
        delay: 0.4 + i * 0.3,
      }).addTo(map);
    });

    // Marqueurs villes avec halo pulsant
    [
      { name: 'Amiens',        coord: [49.8950, 2.3022], note: 'Objectif allemand — nœud ferroviaire vital', side: 'allied' },
      { name: 'Saint-Quentin', coord: [49.8489, 3.2876], note: 'Point de départ allemand',                  side: 'german' },
      { name: 'Arras',         coord: [50.2910, 2.7778], note: 'Aile nord — tenue par les Britanniques',    side: 'allied' },
      { name: 'La Fère',       coord: [49.6614, 3.3672], note: 'Aile sud',                                  side: 'german' },
    ].forEach((c) => {
      MapFX.pulseMarker(c.coord, {
        color: c.side === 'german' ? '#c0392b' : '#3a6b8c',
        size: c.name === 'Amiens' ? 18 : 14,
        label: `<strong>${c.name}</strong><br>${c.note}`,
      }).addTo(map);
      MapFX.cityLabel(c.coord, c.name).addTo(map);
    });

    // Légende
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <span><i style="background:#c0392b"></i> Offensive allemande</span>
        <span><i style="background:#3a6b8c"></i> Positions alliées</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
