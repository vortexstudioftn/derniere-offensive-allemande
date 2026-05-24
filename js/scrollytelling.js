/* ============================================================
   SCROLLYTELLING (GSAP + ScrollTrigger)
   Active les .step quand elles entrent dans la zone centrale.
   Pilote les changements de carte via des événements custom :
   document.dispatchEvent(new CustomEvent('step:enter', { detail: { id } }))
   Les scripts de carte écoutent ces events pour mettre à jour la viz.
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger absent — pas de scrollytelling.');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Active/désactive chaque .step quand elle est au centre de l'écran
    document.querySelectorAll('.step').forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => {
          step.classList.add('is-active');
          const id = step.dataset.step;
          if (id) document.dispatchEvent(new CustomEvent('step:enter', { detail: { id } }));
        },
        onEnterBack: () => {
          step.classList.add('is-active');
          const id = step.dataset.step;
          if (id) document.dispatchEvent(new CustomEvent('step:enter', { detail: { id } }));
        },
        onLeave: () => step.classList.remove('is-active'),
        onLeaveBack: () => step.classList.remove('is-active'),
      });
    });
  });
})();
