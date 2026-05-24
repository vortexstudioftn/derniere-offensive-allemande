/* ============================================================
   CARTE OPÉRATION MICHAEL — 21 mars - 5 avril 1918
   Front Picardie · Saint-Quentin → Amiens
   Coordonnées vérifiées OSM Nominatim + Wikipedia (mai 2026)
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-michael');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-michael', {
      center: [49.90, 2.95],
      zoom: 9,
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

    // Front initial 21 mars (ligne Hindenburg) — 9 waypoints vérifiés
    L.polyline(
      [
        [50.2930, 2.7819],  // Arras
        [50.1931, 2.9286],  // Bullecourt
        [50.1248, 3.1212],  // Flesquières
        [50.0090, 3.2070],  // Vendhuile
        [49.9611, 3.2358],  // Bellicourt
        [49.8489, 3.2876],  // Saint-Quentin
        [49.7472, 3.0736],  // Ham
        [49.6625, 3.3664],  // La Fère
      ],
      { color: '#ffffff', weight: 2, opacity: 0.5, dashArray: '4 6' }
    ).addTo(map);

    // Ligne d'avance maximale (5 avril) — tracé vérifié
    L.polyline(
      [
        [50.1044, 2.8519],  // Bapaume
        [50.0028, 2.6528],  // Albert
        [49.8700, 2.5200],  // Villers-Bretonneux
        [49.7753, 2.4839],  // Moreuil
        [49.6486, 2.5708],  // Montdidier
        [49.7008, 2.7911],  // Roye
        [49.7586, 2.9106],  // Nesle
        [49.5806, 3.0000],  // Noyon
      ],
      { color: '#c0392b', weight: 2, opacity: 0.35, dashArray: '6 4' }
    ).addTo(map);

    // 3 axes d'attaque (17e, 2e, 18e armée)
    // 17e armée (nord) — avance limitée
    MapFX.animatedPolyline(
      [[50.1931, 2.9286], [50.1248, 3.1212], [50.1044, 2.8519]],
      { color: '#c0392b', weight: 4, duration: 1.6, delay: 0.4 }
    ).addTo(map);

    // 2e armée (centre) — percée via Péronne → Albert
    MapFX.animatedPolyline(
      [[50.0090, 3.2070], [49.9292, 2.9325], [50.0028, 2.6528]],
      { color: '#c0392b', weight: 5, duration: 1.8, delay: 0.7 }
    ).addTo(map);

    // 18e armée (sud, Hutier) — percée maximale
    MapFX.animatedPolyline(
      [[49.8489, 3.2876], [49.7586, 2.9106], [49.7008, 2.7911], [49.6486, 2.5708]],
      { color: '#c0392b', weight: 6, duration: 2, delay: 1.0 }
    ).addTo(map);

    // Marqueurs villes vérifiés
    [
      { name: 'Amiens',              coord: [49.8950, 2.3022], note: 'Objectif allemand — nœud ferroviaire vital',   side: 'allied', big: true },
      { name: 'Saint-Quentin',       coord: [49.8489, 3.2876], note: 'Point de départ · 18ᵉ armée (Hutier)',        side: 'german' },
      { name: 'Arras',               coord: [50.2930, 2.7819], note: 'Aile nord — tenue par les Britanniques',      side: 'allied' },
      { name: 'La Fère',             coord: [49.6625, 3.3664], note: 'Aile sud du front',                           side: 'german' },
      { name: 'Péronne',             coord: [49.9292, 2.9325], note: 'Prise le 23 mars',                            side: 'german' },
      { name: 'Albert',              coord: [50.0028, 2.6528], note: 'Prise le 26 mars',                            side: 'german' },
      { name: 'Villers-Bretonneux', coord: [49.8700, 2.5200], note: 'Avance stoppée ici',                          side: 'allied' },
      { name: 'Montdidier',          coord: [49.6486, 2.5708], note: 'Pointe sud-ouest de l\'avance',               side: 'german' },
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
        <span><i style="background:#c0392b"></i> Offensive allemande</span>
        <span><i style="background:#3a6b8c"></i> Positions alliées</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
