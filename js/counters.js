/* ============================================================
   COMPTEURS ANIMÉS
   Anime tout élément .counter de 0 → data-target quand il
   entre dans le viewport. Format français : 1 100 000.
   ============================================================ */
(function () {
  const formatNumber = (n) =>
    Math.round(n).toLocaleString('fr-FR').replace(/ /g, ' ');

  function animateCounter(el) {
    if (el.dataset.done === 'true') return;
    el.dataset.done = 'true';

    const target = parseFloat(el.dataset.target || '0');
    const duration = parseFloat(el.dataset.duration || '2500');
    const suffix = el.dataset.suffix || '';
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic — pour finir doucement
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = formatNumber(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  // Observer : déclenche l'animation quand le compteur entre à l'écran
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) animateCounter(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.counter').forEach((el) => observer.observe(el));
  });
})();
