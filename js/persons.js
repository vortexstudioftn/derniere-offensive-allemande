/* ============================================================
   PERSONNAGES — chargement dynamique depuis data/persons.json
   Si l'image est absente (404), affiche les initiales + un fond
   sombre — comme ça le site tourne même sans avoir téléchargé
   les portraits.
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('persons-grid');
    if (!grid) return;

    // Priorité au fallback inline (marche partout, même en file://)
    if (window.__PERSONS_FALLBACK__) {
      renderPersons(grid, window.__PERSONS_FALLBACK__);
      return;
    }
    // Fallback fetch (au cas où on enlèverait l'inline plus tard)
    fetch('data/persons.json')
      .then((r) => r.json())
      .then((persons) => renderPersons(grid, persons))
      .catch(() => {
        grid.innerHTML = '<p style="color:var(--text-dim);font-style:italic;">Personnages indisponibles.</p>';
      });
  });

  function renderPersons(grid, persons) {
    grid.innerHTML = persons
      .map((p) => {
        const initials = p.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 3)
          .toUpperCase();
        const bgImage = p.img ? `background-image:url('${p.img}');` : '';
        const fallbackInitials = `
          <div class="person-card__fallback" aria-hidden="true">${initials}</div>
        `;
        return `
          <article class="person-card">
            <div class="person-card__img" style="${bgImage}"></div>
            ${p.img ? '' : fallbackInitials}
            <div class="person-card__overlay">
              <p class="person-card__side" data-side="${p.side}">${p.side === 'allemand' ? 'Empire allemand' : 'Alliés'}</p>
              <p class="person-card__name">${p.name}</p>
              <p class="person-card__role">${p.role}</p>
            </div>
          </article>
        `;
      })
      .join('');

    // Si une image foire au chargement, on bascule sur les initiales
    grid.querySelectorAll('.person-card').forEach((card) => {
      const imgDiv = card.querySelector('.person-card__img');
      if (!imgDiv) return;
      const bg = imgDiv.style.backgroundImage;
      if (!bg || bg === 'none') return;
      const url = bg.slice(5, -2);
      const probe = new Image();
      probe.onerror = () => {
        imgDiv.style.backgroundImage = '';
        imgDiv.style.background = 'linear-gradient(135deg, #1f1d1a 0%, #0a0a0a 100%)';
        const card2 = imgDiv.closest('.person-card');
        const nameEl = card2.querySelector('.person-card__name');
        if (!card2.querySelector('.person-card__fallback') && nameEl) {
          const initials = nameEl.textContent
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 3)
            .toUpperCase();
          const div = document.createElement('div');
          div.className = 'person-card__fallback';
          div.textContent = initials;
          card2.insertBefore(div, card2.querySelector('.person-card__overlay'));
        }
      };
      probe.src = url;
    });
  }
})();
