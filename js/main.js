/* ============================================================
   MAIN — orchestration globale
   - Navigation des chapitres (highlight + apparition après le hook)
   - Smooth scroll sur les liens d'ancre
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.chapter-nav');
    const navLinks = document.querySelectorAll('.chapter-nav a');
    const sections = document.querySelectorAll('.section[data-chapter]');

    // Smooth scroll
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Affiche la nav après la première section (le hook)
    const hook = document.querySelector('#hook');
    if (hook && nav) {
      const navObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio < 0.3) nav.classList.add('is-visible');
          else nav.classList.remove('is-visible');
        },
        { threshold: [0, 0.3, 1] }
      );
      navObserver.observe(hook);
    }

    // Highlight du chapitre actif dans la nav
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapter = entry.target.dataset.chapter;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.dataset.chapter === chapter);
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => chapterObserver.observe(s));

    // Console signature (parce que pourquoi pas)
    console.log(
      '%c · La dernière offensive Allemande · ',
      'background:#c0392b;color:#fff;font-family:serif;font-size:14px;padding:4px 12px;letter-spacing:0.15em;'
    );
  });
})();
