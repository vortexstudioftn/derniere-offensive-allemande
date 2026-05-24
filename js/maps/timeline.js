/* ============================================================
   CARTE TIMELINE — "Anatomie de l'offensive"
   Une seule carte plein écran avec un curseur de date en bas.
   Au déplacement du curseur :
   - le tracé du front évolue
   - les flèches d'attaque s'allument/s'éteignent
   - la date + le titre + le sous-titre changent en haut
   - la ville-clé du moment pulse
   ============================================================ */
(function () {
  // Données inline (pas de fetch → marche en file://)
  const STEPS = [
    { date: "20 mars 1918", title: "La veille",                       sub: "Le front Ouest est figé depuis quatre ans.",                                            front: "stable",        arrows: [],                  city: null },
    { date: "21 mars 1918", title: "Opération MICHAEL",               sub: "1,1 million d'obus en 5 heures. La 5ᵉ armée britannique s'effondre.",                  front: "michael_start", arrows: ["michael"],         city: "Amiens" },
    { date: "5 avril 1918", title: "Michael s'épuise",                sub: "60 km gagnés mais Amiens tient. La logistique allemande est dépassée.",                front: "michael_end",   arrows: ["michael"],         city: "Amiens" },
    { date: "9 avril 1918", title: "Opération GEORGETTE",             sub: "Ludendorff frappe en Flandres. Haig : « With our backs to the wall ».",                front: "georgette",     arrows: ["michael","georgette"], city: "Ypres" },
    { date: "27 mai 1918",  title: "Opération BLÜCHER-YORCK",         sub: "Le Chemin des Dames tombe en six heures. Direction la Marne.",                         front: "blucher_start", arrows: ["blucher"],         city: "Chemin des Dames" },
    { date: "3 juin 1918",  title: "Aux portes de Paris",              sub: "Les Allemands atteignent Château-Thierry, à 90 km de Paris.",                          front: "blucher_end",   arrows: ["blucher"],         city: "Château-Thierry" },
    { date: "9 juin 1918",  title: "Opération GNEISENAU",             sub: "Foch est prêt. Mangin contre-attaque. L'avance s'arrête à 8 km.",                      front: "gneisenau",     arrows: ["gneisenau"],       city: "Compiègne" },
    { date: "15 juillet 1918", title: "FRIEDENSTURM",                  sub: "« L'offensive de la paix ». Gouraud applique la défense élastique : l'attaque tombe dans le vide.", front: "friedensturm",  arrows: ["friedensturm"],    city: "Reims" },
    { date: "18 juillet 1918", title: "Le tournant — Villers-Cotterêts", sub: "À l'aube, 225 chars Renault FT surgissent de la forêt. Le saillant cède. La guerre bascule.", front: "counter_marne", arrows: ["counterattack"],   city: "Villers-Cotterêts" },
    { date: "8 août 1918",  title: "« Schwarzer Tag »",                sub: "Le « jour noir » de l'armée allemande à Amiens. Le moral s'effondre.",                  front: "amiens",        arrows: ["amiens"],          city: "Amiens" },
    { date: "26 sept. 1918", title: "Offensive Meuse-Argonne",         sub: "Foch lance l'offensive générale alliée. La ligne Hindenburg craque.",                  front: "retreat_1",     arrows: ["meuse_argonne"],   city: null },
    { date: "11 nov. 1918", title: "Armistice",                        sub: "Wagon de Rethondes, 5h15. Cessez-le-feu à 11 h. L'Allemagne impériale est morte.",     front: "armistice",     arrows: [],                  city: "Rethondes" },
  ];

  // Lignes de front approximatives (en lat/lng) pour chaque "état"
  // (front Ouest stylisé : Nieuport → Ypres → Lens → Saint-Quentin → Reims → Verdun → frontière suisse)
  const FRONTS = {
    stable: [
      [51.13, 2.75], [50.85, 2.88], [50.43, 2.82], [50.07, 2.69], [49.85, 3.29], [49.45, 3.75], [49.26, 4.03], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    michael_start: [
      [51.13, 2.75], [50.85, 2.88], [50.43, 2.82], [50.07, 2.69], [49.95, 3.05], [49.70, 3.10], [49.45, 3.75], [49.26, 4.03], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    michael_end: [
      [51.13, 2.75], [50.85, 2.88], [50.43, 2.82], [49.95, 2.55], [49.93, 2.85], [49.55, 2.70], [49.45, 3.75], [49.26, 4.03], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    georgette: [
      [51.10, 2.65], [50.78, 2.65], [50.55, 2.60], [49.95, 2.55], [49.93, 2.85], [49.55, 2.70], [49.45, 3.75], [49.26, 4.03], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    blucher_start: [
      [51.10, 2.65], [50.78, 2.65], [50.55, 2.60], [49.95, 2.55], [49.93, 2.85], [49.55, 2.70], [49.30, 3.40], [49.05, 3.40], [49.10, 4.10], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    blucher_end: [
      [51.10, 2.65], [50.78, 2.65], [50.55, 2.60], [49.95, 2.55], [49.93, 2.85], [49.55, 2.70], [49.30, 3.35], [49.05, 3.40], [48.93, 3.45], [49.05, 4.10], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    gneisenau: [
      [51.10, 2.65], [50.78, 2.65], [50.55, 2.60], [49.95, 2.55], [49.65, 2.60], [49.55, 2.78], [49.30, 3.35], [49.05, 3.40], [48.93, 3.45], [49.05, 4.10], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    friedensturm: [
      [51.10, 2.65], [50.78, 2.65], [50.55, 2.60], [49.95, 2.55], [49.65, 2.60], [49.55, 2.78], [49.30, 3.35], [49.05, 3.40], [48.93, 3.55], [49.10, 4.15], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    counter_marne: [
      [51.10, 2.65], [50.78, 2.65], [50.55, 2.60], [49.95, 2.55], [49.65, 2.60], [49.55, 2.78], [49.32, 3.30], [49.20, 3.55], [49.15, 3.90], [49.25, 4.20], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    amiens: [
      [51.10, 2.65], [50.78, 2.65], [50.55, 2.60], [50.10, 2.55], [49.85, 2.80], [49.65, 3.10], [49.45, 3.50], [49.30, 3.90], [49.25, 4.20], [49.21, 5.10], [48.80, 5.50], [47.55, 7.00],
    ],
    retreat_1: [
      [51.10, 2.65], [50.78, 3.20], [50.55, 3.55], [50.30, 3.80], [50.05, 4.15], [49.75, 4.55], [49.50, 5.05], [49.20, 5.50], [48.80, 5.80], [47.55, 7.00],
    ],
    armistice: [
      [51.30, 4.00], [50.85, 4.35], [50.45, 4.85], [50.10, 5.55], [49.75, 6.10], [49.45, 6.55], [49.05, 7.00], [48.50, 7.40], [47.55, 7.50],
    ],
  };

  // Flèches d'attaque par opération
  const ARROWS = {
    michael: [
      { path: [[49.95, 3.55], [49.93, 2.85]], color: '#c0392b' },
      { path: [[49.7, 3.5], [49.6, 2.6]], color: '#c0392b' },
    ],
    georgette: [
      { path: [[50.78, 3.05], [50.65, 2.78]], color: '#c0392b' },
    ],
    blucher: [
      { path: [[49.5, 3.7], [49.05, 3.4]], color: '#c0392b' },
      { path: [[49.45, 3.85], [49.05, 3.42]], color: '#c0392b' },
    ],
    gneisenau: [
      { path: [[49.6, 2.93], [49.6, 2.6]], color: '#c0392b' },
    ],
    friedensturm: [
      { path: [[49.42, 4.25], [49.32, 4.05]], color: '#c0392b' },
      { path: [[49.15, 4.45], [49.22, 4.18]], color: '#c0392b' },
    ],
    counterattack: [
      { path: [[49.27, 3.05], [49.30, 3.80]], color: '#3a6b8c' },
    ],
    amiens: [
      { path: [[49.95, 2.6], [49.85, 2.95]], color: '#3a6b8c' },
    ],
    meuse_argonne: [
      { path: [[49.20, 5.10], [49.40, 4.85]], color: '#3a6b8c' },
      { path: [[48.80, 5.50], [49.10, 5.20]], color: '#3a6b8c' },
    ],
  };

  // Villes notables (avec coords)
  const CITIES = {
    "Amiens":             [49.8950, 2.3022],
    "Ypres":              [50.8503, 2.8853],
    "Chemin des Dames":   [49.4500, 3.7000],
    "Château-Thierry":    [49.0411, 3.4006],
    "Compiègne":          [49.4179, 2.8261],
    "Reims":              [49.2583, 4.0317],
    "Villers-Cotterêts":  [49.2553, 3.0903],
    "Rethondes":          [49.4253, 2.9056],
    "Paris":              [48.8566, 2.3522],
  };

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('map-timeline');
    if (!container || typeof L === 'undefined' || !window.MapFX) return;

    const map = L.map('map-timeline', {
      center: [49.5, 3.5],
      zoom: 7,
      zoomControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
      zoomSnap: 0.25,
    });
    MapFX.darkTiles().addTo(map);

    // Couches dynamiques
    let frontLayer = null;
    let arrowLayer = L.layerGroup().addTo(map);
    let cityHighlightLayer = L.layerGroup().addTo(map);
    let parisMarker = MapFX.pulseMarker(CITIES.Paris, { color: '#3a6b8c', size: 14, label: '<strong>Paris</strong>' });
    parisMarker.addTo(map);
    MapFX.cityLabel(CITIES.Paris, 'PARIS').addTo(map);

    // DOM du panneau d'info
    const titleEl = document.getElementById('timeline-title');
    const subEl = document.getElementById('timeline-sub');
    const dateEl = document.getElementById('timeline-date');
    const slider = document.getElementById('timeline-slider');
    const ticksEl = document.getElementById('timeline-ticks');

    // Génère les graduations sous le slider
    if (ticksEl) {
      ticksEl.innerHTML = STEPS.map((s, i) => {
        const pct = (i / (STEPS.length - 1)) * 100;
        return `<button class="tick" data-index="${i}" style="left:${pct}%" title="${s.date} — ${s.title}"><span></span></button>`;
      }).join('');
      ticksEl.querySelectorAll('.tick').forEach((btn) => {
        btn.addEventListener('click', () => {
          slider.value = btn.dataset.index;
          render(parseInt(btn.dataset.index, 10));
        });
      });
    }

    function render(idx) {
      const step = STEPS[idx];
      if (!step) return;

      // Update text
      if (dateEl) dateEl.textContent = step.date;
      if (titleEl) titleEl.textContent = step.title;
      if (subEl) subEl.textContent = step.sub;

      // Update tick active
      ticksEl?.querySelectorAll('.tick').forEach((btn, i) => {
        btn.classList.toggle('is-active', i === idx);
        btn.classList.toggle('is-passed', i < idx);
      });

      // Front line
      if (frontLayer) map.removeLayer(frontLayer);
      const frontCoords = FRONTS[step.front] || FRONTS.stable;
      frontLayer = L.polyline(frontCoords, {
        color: '#e8e6e1',
        weight: 3,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map);

      // Arrows
      arrowLayer.clearLayers();
      (step.arrows || []).forEach((key) => {
        (ARROWS[key] || []).forEach((a) => {
          MapFX.animatedPolyline(a.path, {
            color: a.color, weight: 5, duration: 1.2, delay: 0.1,
          }).addTo(arrowLayer);
        });
      });

      // City highlight (pulse)
      cityHighlightLayer.clearLayers();
      if (step.city && CITIES[step.city]) {
        MapFX.pulseMarker(CITIES[step.city], {
          color: '#fff', size: 18, label: `<strong>${step.city}</strong>`,
        }).addTo(cityHighlightLayer);
        MapFX.cityLabel(CITIES[step.city], step.city.toUpperCase(), { color: '#fff' }).addTo(cityHighlightLayer);
      }
    }

    // Init slider
    if (slider) {
      slider.min = 0;
      slider.max = STEPS.length - 1;
      slider.value = 0;
      slider.step = 1;
      slider.addEventListener('input', () => render(parseInt(slider.value, 10)));
    }

    // Sync mode clavier : ← → bouge le slider sur la section anatomie
    document.addEventListener('presentation:step', (e) => {
      if (e.detail.sectionId !== 'anatomie') return;
      const idx = e.detail.stepIdx;
      if (slider) slider.value = idx;
      render(idx);
    });

    // Render initial
    render(0);

    // Légende
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <span><i style="background:#e8e6e1"></i> Ligne de front</span>
        <span><i style="background:#c0392b"></i> Offensives allemandes</span>
        <span><i style="background:#3a6b8c"></i> Contre-offensives alliées</span>
      `;
      return div;
    };
    legend.addTo(map);
  });
})();
