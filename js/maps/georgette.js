/* ============================================================
   CARTE OPÉRATION GEORGETTE — 9 - 29 avril 1918 · Flandres
   Coordonnées vérifiées OSM Nominatim + Wikipedia (mai 2026)
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-georgette');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-georgette', {
      center: [50.69, 2.80],
      zoom: 10,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });

    MapFX.darkTiles().addTo(map);

    // Front initial (nord → sud)
    L.polyline(
      [
        [50.8522, 2.8846],  // Ypres
        [50.7857, 2.8826],  // Wytschaete
        [50.7598, 2.8998],  // Messines
        [50.6867, 2.8822],  // Armentières
        [50.5839, 2.7799],  // Neuve-Chapelle
        [50.5316, 2.8047],  // La Bassée
      ],
      { color: '#ffffff', weight: 2, opacity: 0.5, dashArray: '4 6' }
    ).addTo(map);

    // Attaque nord (vallée de la Lys)
    MapFX.animatedPolyline(
      [[50.6867, 2.8822], [50.6440, 2.7227], [50.6437, 2.6387]],
      { color: '#c0392b', weight: 5, duration: 1.8, delay: 0.4 }
    ).addTo(map);

    // Attaque sud (La Bassée → Locon)
    MapFX.animatedPolyline(
      [[50.5316, 2.8047], [50.5707, 2.6665], [50.5839, 2.7799]],
      { color: '#c0392b', weight: 5, duration: 1.8, delay: 0.7 }
    ).addTo(map);

    // Poussée vers Kemmel (haute importance)
    MapFX.animatedPolyline(
      [[50.7598, 2.8998], [50.7790, 2.8130], [50.7397, 2.7349]],
      { color: '#c0392b', weight: 4, duration: 1.5, delay: 1.2 }
    ).addTo(map);

    [
      { name: 'Ypres',         coord: [50.8522, 2.8846], note: 'Verrou britannique — tient',        side: 'allied', big: true },
      { name: 'Armentières',   coord: [50.6867, 2.8822], note: 'Tombée le 11 avril 1918',            side: 'german' },
      { name: 'La Bassée',     coord: [50.5316, 2.8047], note: 'Aile sud allemande',                 side: 'german' },
      { name: 'Hazebrouck',    coord: [50.7226, 2.5360], note: 'Objectif final non atteint',         side: 'allied' },
      { name: 'Bailleul',      coord: [50.7397, 2.7349], note: 'Prise le 15 avril',                  side: 'german' },
      { name: 'Mont Kemmel',   coord: [50.7790, 2.8130], note: 'Hauteur clé — prise le 25 avril',   side: 'german' },
      { name: 'Merville',      coord: [50.6437, 2.6387], note: 'Prise — avance vers Hazebrouck',    side: 'german' },
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
