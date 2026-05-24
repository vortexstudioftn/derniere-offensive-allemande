/* ============================================================
   PERSONNAGES — scrollytelling cinématique
   Un step par personnage avec portrait plein écran.
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const stepsContainer = document.getElementById('perso-steps');
    const portrait = document.getElementById('perso-portrait');
    if (!stepsContainer || !portrait) return;

    const persons = window.__PERSONS_FALLBACK__ || [];
    if (!persons.length) return;

    const bgEl = portrait.querySelector('.persos-cine__bg');
    const fallbackEl = portrait.querySelector('.persos-cine__fallback');
    const sideTag = portrait.querySelector('.persos-cine__side-tag');

    // Build steps HTML
    stepsContainer.innerHTML = persons.map((p, i) => {
      const sideLabel = p.side === 'allemand' ? 'Empire allemand' : 'Alliés';
      return `
        <article class="step step--perso" data-step="perso-${i + 1}" data-side="${p.side}" data-perso-idx="${i}">
          <p class="step--perso__side" data-side="${p.side}">${sideLabel}</p>
          <h2 class="step--perso__name">${p.name}</h2>
          <p class="step--perso__role">${p.role}</p>
          <p class="step--perso__bio">${p.bio}</p>
        </article>
      `;
    }).join('');

    // Current active person
    let currentIdx = -1;

    function showPerson(idx) {
      if (idx === currentIdx || idx < 0 || idx >= persons.length) return;
      currentIdx = idx;
      const p = persons[idx];

      // Portrait background
      if (p.img) {
        bgEl.style.backgroundImage = `url('${p.img}')`;
        bgEl.style.filter = 'grayscale(1) contrast(1.1) brightness(0.55)';
        bgEl.style.transform = 'scale(1.05)';
        setTimeout(() => { bgEl.style.transform = 'scale(1)'; }, 50);
        fallbackEl.style.opacity = '0';
      } else {
        bgEl.style.backgroundImage = '';
        bgEl.style.filter = '';
        const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
        fallbackEl.textContent = initials;
        fallbackEl.style.opacity = '1';
      }

      // Probe image — fallback to initials on error
      if (p.img) {
        const probe = new Image();
        probe.onerror = () => {
          bgEl.style.backgroundImage = '';
          const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
          fallbackEl.textContent = initials;
          fallbackEl.style.opacity = '1';
        };
        probe.src = p.img;
      }

      // Side tag + portrait border
      if (sideTag) {
        sideTag.textContent = p.side === 'allemand' ? 'Empire allemand' : 'Alliés';
        sideTag.style.color = p.side === 'allemand' ? 'var(--accent)' : 'var(--allied)';
      }
      const portraitFrame = portrait;
      if (portraitFrame) {
        portraitFrame.style.borderColor = p.side === 'allemand'
          ? 'rgba(192,57,43,0.4)' : 'rgba(58,107,140,0.4)';
      }
    }

    // Show first person by default
    showPerson(0);

    // ScrollTrigger for each step
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      stepsContainer.querySelectorAll('.step--perso').forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => {
            step.classList.add('is-active');
            showPerson(parseInt(step.dataset.persoIdx));
          },
          onEnterBack: () => {
            step.classList.add('is-active');
            showPerson(parseInt(step.dataset.persoIdx));
          },
          onLeave: () => step.classList.remove('is-active'),
          onLeaveBack: () => step.classList.remove('is-active'),
        });
      });
    }

    // Keyboard nav support (listens for step:enter events from presentation.js)
    document.addEventListener('step:enter', (e) => {
      const id = e.detail.id;
      if (!id || !id.startsWith('perso-')) return;
      const idx = parseInt(id.replace('perso-', '')) - 1;
      showPerson(idx);
    });
  });
})();
