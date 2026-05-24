/* ============================================================
   PRESENTATION CONTROLLER
   Mode clavier pour piloter la présentation en classe.

   - ←  / →  : avancer / reculer DANS le step courant
   - ↑  / ↓  : passer au chapitre précédent / suivant
   - Espace : avancer (= flèche droite)
   - Le scroll souris continue de marcher (les deux modes cohabitent)

   Chaque section déclare son nombre de "steps" interactifs.
   Quand on entre/sort en mode clavier, on émet :
   - 'step:enter' { id } → consommé par les cartes (compat avec scroll)
   - 'presentation:step' { sectionIdx, stepIdx } → consommé par le timeline
   ============================================================ */
(function () {
  // Liste ordonnée des sections + nombre de steps interactifs
  // Pour les sections sans steps, on met stepCount = 1 (la section est elle-même un step)
  const SECTIONS = [
    { id: 'hook',          stepCount: 1, label: 'Ouverture' },
    { id: 'contexte',      stepCount: 4, label: 'Contexte', stepIdPrefix: 'context-' }, // context-1 à context-4
    { id: 'plan',          stepCount: 1, label: 'Plan Ludendorff' },
    { id: 'anatomie',      stepCount: 12, label: 'Anatomie' }, // 12 dates du slider
    { id: 'persos',        stepCount: 1, label: 'Personnages' },
    // Batailles : chaque sous-bataille est traitée comme une "sous-section"
    { id: 'battle-michael',    stepCount: 4, label: 'Michael',     parent: 'batailles' },
    { id: 'battle-georgette',  stepCount: 3, label: 'Georgette',   parent: 'batailles' },
    { id: 'battle-blucher',    stepCount: 3, label: 'Blücher-Yorck', parent: 'batailles' },
    { id: 'battle-gneisenau',  stepCount: 3, label: 'Gneisenau',   parent: 'batailles' },
    { id: 'friedensturm',  stepCount: 5, label: 'Friedensturm' },
    { id: 'bilan',         stepCount: 1, label: 'Bilan' },
    { id: 'sources',       stepCount: 1, label: 'Sources' },
  ];

  class PresentationController {
    constructor() {
      this.sections = SECTIONS;
      this.currentSection = 0;
      this.currentStep = 0;
      this.keyboardActivated = false;
      this.scrollTimer = null;

      this.bindKeys();
      this.bindScroll();
      this.initHUD();

      // Émet l'état initial
      this.emit();
    }

    bindKeys() {
      document.addEventListener('keydown', (e) => {
        // Ignore si on tape dans un input
        if (e.target.matches('input, textarea, [contenteditable]')) return;

        let handled = true;
        switch (e.key) {
          case 'ArrowRight':
          case ' ':
            this.nextStep();
            break;
          case 'ArrowLeft':
            this.prevStep();
            break;
          case 'ArrowDown':
          case 'PageDown':
            this.nextSection();
            break;
          case 'ArrowUp':
          case 'PageUp':
            this.prevSection();
            break;
          case 'Home':
            this.goTo(0, 0);
            break;
          case 'End':
            this.goTo(this.sections.length - 1, 0);
            break;
          default:
            handled = false;
        }
        if (handled) {
          e.preventDefault();
          this.activateKeyboardMode();
        }
      });
    }

    bindScroll() {
      // Synchronise currentSection avec le scroll utilisateur
      // (pour que les touches reprennent depuis le bon endroit après un scroll)
      const observerSections = this.sections
        .filter((s) => !s.parent || s.id.startsWith('battle-'))
        .map((s) => document.getElementById(s.id))
        .filter(Boolean);

      const observer = new IntersectionObserver(
        (entries) => {
          if (this.keyboardActivated) return; // Ne pas écraser l'état clavier
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const idx = this.sections.findIndex((s) => s.id === entry.target.id);
              if (idx >= 0 && idx !== this.currentSection) {
                this.currentSection = idx;
                this.currentStep = 0;
                this.updateHUD();
              }
            }
          });
        },
        { threshold: [0, 0.5, 1] }
      );
      observerSections.forEach((el) => observer.observe(el));

      // Quand l'user scrolle, on suspend le mode clavier
      let scrollUserTriggered = false;
      window.addEventListener('wheel', () => {
        scrollUserTriggered = true;
        this.keyboardActivated = false;
      }, { passive: true });
      window.addEventListener('touchmove', () => {
        scrollUserTriggered = true;
        this.keyboardActivated = false;
      }, { passive: true });
    }

    nextStep() {
      const section = this.sections[this.currentSection];
      if (this.currentStep < section.stepCount - 1) {
        this.currentStep++;
        this.emit();
      } else {
        this.nextSection();
      }
    }

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.emit();
      } else {
        // Aller à la fin du chapitre précédent
        if (this.currentSection > 0) {
          this.currentSection--;
          this.currentStep = this.sections[this.currentSection].stepCount - 1;
          this.scrollToSection();
          this.emit();
        }
      }
    }

    nextSection() {
      if (this.currentSection < this.sections.length - 1) {
        this.currentSection++;
        this.currentStep = 0;
        this.scrollToSection();
        this.emit();
      }
    }

    prevSection() {
      if (this.currentSection > 0) {
        this.currentSection--;
        this.currentStep = 0;
        this.scrollToSection();
        this.emit();
      }
    }

    goTo(sectionIdx, stepIdx = 0) {
      this.currentSection = Math.max(0, Math.min(this.sections.length - 1, sectionIdx));
      this.currentStep = Math.max(0, Math.min(this.sections[this.currentSection].stepCount - 1, stepIdx));
      this.scrollToSection();
      this.emit();
    }

    scrollToSection() {
      const section = this.sections[this.currentSection];
      // Si c'est une sous-bataille, on cible son élément directement
      const targetId = section.id;
      const el = document.getElementById(targetId);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    activateKeyboardMode() {
      if (!this.keyboardActivated) {
        this.keyboardActivated = true;
        document.body.classList.add('keyboard-mode');
        this.showHUD();
      }
    }

    emit() {
      const section = this.sections[this.currentSection];

      // Event spécifique mode présentation
      document.dispatchEvent(new CustomEvent('presentation:step', {
        detail: {
          sectionId: section.id,
          sectionIdx: this.currentSection,
          stepIdx: this.currentStep,
          stepCount: section.stepCount,
        },
      }));

      // Event compatible avec les cartes (qui écoutent step:enter)
      if (section.stepIdPrefix) {
        document.dispatchEvent(new CustomEvent('step:enter', {
          detail: { id: `${section.stepIdPrefix}${this.currentStep + 1}` },
        }));
      }

      // Met à jour le surlignage des .step (visuel)
      this.updateActiveStep();
      this.updateHUD();
    }

    updateActiveStep() {
      const section = this.sections[this.currentSection];
      const container = document.getElementById(section.id);
      if (!container) return;
      const steps = container.querySelectorAll('.step');
      if (!steps.length) return;

      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === this.currentStep);
      });

      // Scroll le step actif au centre (pour les sections scrollytelling)
      const activeStep = steps[this.currentStep];
      if (activeStep && this.keyboardActivated) {
        activeStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    /* ─── HUD (indicateur visuel en bas) ─── */

    initHUD() {
      const hud = document.createElement('div');
      hud.className = 'kbd-hud';
      hud.innerHTML = `
        <div class="kbd-hud__inner">
          <span class="kbd-hud__chapter"></span>
          <span class="kbd-hud__progress"></span>
          <span class="kbd-hud__keys">
            <kbd>←</kbd><kbd>→</kbd> <span>étapes</span>
            <kbd>↑</kbd><kbd>↓</kbd> <span>chapitres</span>
          </span>
        </div>
      `;
      document.body.appendChild(hud);
      this.hud = hud;
    }

    showHUD() {
      if (this.hud) this.hud.classList.add('is-visible');
    }

    updateHUD() {
      if (!this.hud) return;
      const section = this.sections[this.currentSection];
      const ch = this.hud.querySelector('.kbd-hud__chapter');
      const pr = this.hud.querySelector('.kbd-hud__progress');
      if (ch) ch.textContent = `${String(this.currentSection + 1).padStart(2, '0')} · ${section.label}`;
      if (pr) {
        pr.textContent = section.stepCount > 1
          ? `Étape ${this.currentStep + 1} / ${section.stepCount}`
          : '';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new PresentationController();
  });
})();
