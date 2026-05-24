/* ============================================================
   SCROLLYTELLING (GSAP + ScrollTrigger)
   1. Active les .step au scroll
   2. Parallax sur les image-bleed
   3. Reveal animé des titres de section
   4. Transitions progressives des couches de carte
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger absent — pas de scrollytelling.');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* ─── 1. Steps : active/désactive au centre de l'écran ─── */
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

    /* ─── 2. Parallax sur les images-bleed ─── */
    document.querySelectorAll('.image-bleed__img').forEach((img) => {
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.image-bleed'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    /* ─── 3. Reveal animé des titres de section ─── */
    document.querySelectorAll('.section__title').forEach((title) => {
      // Découpe le titre en mots et les wrappe dans des spans
      const words = title.textContent.trim().split(/\s+/);
      title.innerHTML = words.map((w) =>
        `<span class="word-reveal"><span class="word-reveal__inner">${w}</span></span>`
      ).join(' ');

      const inners = title.querySelectorAll('.word-reveal__inner');
      gsap.set(inners, { yPercent: 110, opacity: 0 });

      ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(inners, {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          });
        },
      });
    });

    // Même effet pour les overlines
    document.querySelectorAll('.section__overline').forEach((el) => {
      gsap.set(el, { opacity: 0, y: 15 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        },
      });
    });

    // Lede (sous-titre)
    document.querySelectorAll('.section__lede').forEach((el) => {
      gsap.set(el, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
        },
      });
    });

    /* ─── 4. Fade progressif des image-bleed captions ─── */
    document.querySelectorAll('.image-bleed__caption').forEach((caption) => {
      gsap.set(caption, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: caption.closest('.image-bleed'),
        start: 'top 40%',
        once: true,
        onEnter: () => {
          gsap.to(caption, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
        },
      });
    });

    /* ─── 5. Stats du bilan — compteur + reveal ─── */
    document.querySelectorAll('.stat__num').forEach((el) => {
      gsap.set(el, { opacity: 0, scale: 0.8 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' });
        },
      });
    });
  });
})();
