/* ============================================================
   HELPERS partagés pour les cartes Leaflet
   - Crée des couches OSM filtrées sombre
   - Crée des polylines animées qui se "dessinent" (stroke-dashoffset)
   - Crée des marqueurs avec halo pulsant
   - Crée des flèches avec pointe (arrowhead via plugin maison léger)
   ============================================================ */
(function () {
  if (typeof L === 'undefined') return;

  const NS = (window.MapFX = {});

  /* --- Tile layer sombre --- */
  NS.darkTiles = function () {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      minZoom: 3,
      attribution: '© OpenStreetMap',
    });
  };

  /* --- Polyline animée (effet "stroke draw") + arrowhead optionnel
     Si options.arrow = true, ajoute une pointe triangulaire orientée à la fin.
  --- */
  NS.animatedPolyline = function (latlngs, options = {}) {
    const opts = Object.assign({
      color: '#c0392b',
      weight: 5,
      opacity: 0.95,
      duration: 1.6,
      delay: 0,
      lineCap: 'round',
      lineJoin: 'round',
      arrow: true,         // pointe par défaut
      arrowSize: 16,       // px
    }, options);

    const group = L.layerGroup();
    const poly = L.polyline(latlngs, opts);
    poly.addTo(group);

    // Animation de tracé
    poly.on('add', function () {
      requestAnimationFrame(() => {
        const path = poly.getElement();
        if (!path) return;
        const length = path.getTotalLength();
        path.style.transition = 'none';
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.getBoundingClientRect();
        path.style.transition = `stroke-dashoffset ${opts.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${opts.delay}s, opacity 0.3s`;
        path.style.strokeDashoffset = '0';
        path.style.filter = `drop-shadow(0 0 6px ${opts.color}aa)`;
      });
    });

    // Pointe de flèche orientée
    if (opts.arrow && latlngs.length >= 2) {
      const arrowHead = NS._arrowHead(latlngs, opts);
      arrowHead.addTo(group);
      // Délai d'apparition : on attend la fin de l'animation de tracé
      arrowHead.on('add', () => {
        requestAnimationFrame(() => {
          const el = arrowHead.getElement();
          if (!el) return;
          el.style.opacity = '0';
          el.style.transition = `opacity 0.4s ease ${opts.delay + opts.duration * 0.85}s`;
          requestAnimationFrame(() => { el.style.opacity = '1'; });
        });
      });
    }

    return group;
  };

  /* --- Pointe de flèche orientée (divIcon SVG triangle) --- */
  NS._arrowHead = function (latlngs, opts) {
    const last = latlngs[latlngs.length - 1];
    const prev = latlngs[latlngs.length - 2];

    // Calcul de l'angle (projection planaire approximative — suffisant pour des distances courtes)
    const dy = last[0] - prev[0];
    const dx = (last[1] - prev[1]) * Math.cos((last[0] * Math.PI) / 180);
    let angleDeg = (Math.atan2(-dy, dx) * 180) / Math.PI; // 0° = est, va anti-horaire
    // SVG : 0° pointe vers la droite ; on veut que la pointe soit dans le sens de la flèche
    // On rotate l'icône de "angleDeg" pour qu'elle pointe dans la bonne direction
    const cssAngle = -angleDeg; // CSS rotate est horaire

    const size = opts.arrowSize;
    const color = opts.color;
    const html = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(${cssAngle}deg);transform-origin:center;display:block;filter:drop-shadow(0 0 4px ${color}cc);">
        <polygon points="${size},${size / 2} 0,0 ${size * 0.3},${size / 2} 0,${size}"
                 fill="${color}" stroke="rgba(255,255,255,0.85)" stroke-width="1" stroke-linejoin="round"/>
      </svg>
    `;

    const icon = L.divIcon({
      className: 'arrow-head',
      html,
      iconSize: [size, size],
      iconAnchor: [size, size / 2],
    });
    return L.marker(last, { icon, interactive: false });
  };

  /* --- Marqueur avec halo pulsant (divIcon CSS) --- */
  NS.pulseMarker = function (latlng, options = {}) {
    const opts = Object.assign({
      color: '#c0392b',
      size: 14,
      label: '',
      labelDir: 'top',
    }, options);

    const icon = L.divIcon({
      className: 'pulse-marker',
      html: `
        <span class="pulse-marker__core" style="background:${opts.color};width:${opts.size}px;height:${opts.size}px;"></span>
        <span class="pulse-marker__ring" style="border-color:${opts.color};width:${opts.size}px;height:${opts.size}px;"></span>
      `,
      iconSize: [opts.size, opts.size],
      iconAnchor: [opts.size / 2, opts.size / 2],
    });

    const marker = L.marker(latlng, { icon });
    if (opts.label) {
      marker.bindTooltip(opts.label, {
        direction: opts.labelDir,
        permanent: false,
        className: 'map-tooltip',
        offset: [0, -opts.size / 2],
      });
    }
    return marker;
  };

  /* --- Étiquette de ville permanente (label discret) --- */
  NS.cityLabel = function (latlng, name, options = {}) {
    const opts = Object.assign({
      color: '#e8e6e1',
      size: 11,
      anchor: [0, -14],
    }, options);

    const icon = L.divIcon({
      className: 'city-label',
      html: `<span style="color:${opts.color};font-size:${opts.size}px;">${name}</span>`,
      iconSize: null,
      iconAnchor: opts.anchor,
    });
    return L.marker(latlng, { icon, interactive: false });
  };

  /* --- Polygone "zone d'avance" (semi-transparent, rempli) --- */
  NS.areaPolygon = function (latlngs, options = {}) {
    const opts = Object.assign({
      color: '#c0392b',
      weight: 1,
      opacity: 0.6,
      fillColor: '#c0392b',
      fillOpacity: 0.18,
    }, options);
    return L.polygon(latlngs, opts);
  };
})();
