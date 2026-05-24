/* ============================================================
   CARTE OPÉRATION BLÜCHER-YORCK — 27 mai - 6 juin 1918
   Chemin des Dames → Marne · Aux portes de Paris
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-blucher');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-blucher', {
      center: [49.1, 3.2],
      zoom: 8,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Front initial Chemin des Dames
    L.polyline(
      [[49.5, 3.55], [49.4500, 3.7000], [49.4, 4.05]],
      { color: '#ffffff', weight: 2, opacity: 0.4, dashArray: '4 6' }
    ).addTo(map);

    // Zone d'avance spectaculaire (semi-transparente)
    MapFX.areaPolygon([
      [49.5, 3.55], [49.45, 3.85], [49.20, 3.75], [49.05, 3.4], [49.1, 3.2], [49.3, 3.25], [49.5, 3.55],
    ], { fillOpacity: 0.22 }).addTo(map);

    // Flèches d'attaque vers la Marne
    [
      [[49.5, 3.7], [49.3, 3.55], [49.05, 3.4]],
      [[49.45, 3.85], [49.2, 3.7], [49.07, 3.42]],
    ].forEach((p, i) => {
      MapFX.animatedPolyline(p, {
        color: '#c0392b', weight: 6, duration: 2, delay: 0.4 + i * 0.4,
      }).addTo(map);
    });

    // Halo Paris (menace)
    L.circle([48.8566, 2.3522], {
      radius: 30000, color: '#3a6b8c',
      fillColor: '#3a6b8c', fillOpacity: 0.08,
      weight: 1.5, dashArray: '6 6',
    }).addTo(map);

    [
      { name: 'Chemin des Dames', coord: [49.4500, 3.7000], note: 'Front rompu en 6 heures',                  side: 'german' },
      { name: 'Soissons',         coord: [49.3815, 3.3236], note: 'Tombée le 29 mai 1918',                    side: 'german' },
      { name: 'Château-Thierry',  coord: [49.0411, 3.4006], note: '90 km de Paris — stoppé par les US',       side: 'allied', big: true },
      { name: 'Reims',            coord: [49.2583, 4.0317], note: 'Verrou allié — non pris',                  side: 'allied' },
      { name: 'Paris',            coord: [48.8566, 2.3522], note: 'Le gouvernement envisage d\'évacuer',  side: 'allied', big: true },
    ].forEach((c) => {
      MapFX.pulseMarker(c.coord, {
        color: c.side === 'german' ? '#c0392b' : '#3a6b8c',
        size: c.big ? 20 : 14,
        label: `<strong>${c.name}</strong><br>${c.note}`,
      }).addTo(map);
      MapFX.cityLabel(c.coord, c.name).addTo(map);
    });

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <span><i style="background:#c0392b"></i> Avance allemande</span>
        <span><i style="background:#3a6b8c"></i> Défense alliée</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
