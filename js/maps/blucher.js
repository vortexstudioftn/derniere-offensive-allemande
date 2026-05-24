/* ============================================================
   CARTE OPÉRATION BLÜCHER-YORCK — 27 mai - 6 juin 1918
   Chemin des Dames → Marne · Aux portes de Paris
   Coordonnées vérifiées OSM Nominatim + Wikipedia (mai 2026)
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-blucher');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-blucher', {
      center: [49.20, 3.55],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Front initial — Chemin des Dames (crête, ouest → est)
    L.polyline(
      [
        [49.3838, 3.3276],  // Soissons
        [49.4557, 3.4900],  // Chemin des Dames ouest
        [49.4394, 3.7872],  // Craonne
        [49.4032, 3.8998],  // Berry-au-Bac
        [49.2578, 4.0319],  // Reims
      ],
      { color: '#ffffff', weight: 2, opacity: 0.5, dashArray: '4 6' }
    ).addTo(map);

    // Zone d'avance (saillant créé, du Chemin des Dames jusqu'à la Marne)
    MapFX.areaPolygon([
      [49.4557, 3.4900],   // Chemin des Dames ouest
      [49.4394, 3.7872],   // Craonne
      [49.4032, 3.8998],   // Berry-au-Bac
      [49.3072, 3.6803],   // Fismes
      [49.2012, 3.5135],   // Fère-en-Tardenois
      [49.0839, 3.2930],   // Belleau
      [49.0457, 3.4027],   // Château-Thierry (Marne)
      [49.0746, 3.6384],   // Dormans (Marne)
      [49.2578, 4.0319],   // Reims (tient)
    ], { fillOpacity: 0.18 }).addTo(map);

    // Axe central — Chemin des Dames → Marne via Fismes
    MapFX.animatedPolyline(
      [[49.4394, 3.7872], [49.3072, 3.6803], [49.2012, 3.5135], [49.0457, 3.4027]],
      { color: '#c0392b', weight: 6, duration: 2, delay: 0.4 }
    ).addTo(map);

    // Axe ouest — vers Soissons / Belleau
    MapFX.animatedPolyline(
      [[49.4557, 3.4900], [49.3838, 3.3276], [49.0839, 3.2930]],
      { color: '#c0392b', weight: 5, duration: 1.8, delay: 0.8 }
    ).addTo(map);

    // Halo Paris (menace)
    L.circle([48.8566, 2.3522], {
      radius: 30000, color: '#3a6b8c',
      fillColor: '#3a6b8c', fillOpacity: 0.08,
      weight: 1.5, dashArray: '6 6',
    }).addTo(map);

    [
      { name: 'Chemin des Dames', coord: [49.4557, 3.4900], note: 'Front rompu en 6 heures',                 side: 'german' },
      { name: 'Craonne',          coord: [49.4394, 3.7872], note: 'Crête du Chemin des Dames',               side: 'german' },
      { name: 'Soissons',         coord: [49.3838, 3.3276], note: 'Tombée le 29 mai',                        side: 'german' },
      { name: 'Fismes',           coord: [49.3072, 3.6803], note: 'Sur la Vesle — mi-chemin',                side: 'german' },
      { name: 'Château-Thierry',  coord: [49.0457, 3.4027], note: '90 km de Paris — stoppé par les US',      side: 'allied', big: true },
      { name: 'Belleau',          coord: [49.0839, 3.2930], note: 'Bois de Belleau — US Marines',            side: 'allied' },
      { name: 'Reims',            coord: [49.2578, 4.0319], note: 'Verrou allié — non pris',                 side: 'allied', big: true },
      { name: 'Paris',            coord: [48.8566, 2.3522], note: 'Le gouvernement envisage d\'évacuer',     side: 'allied', big: true },
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
