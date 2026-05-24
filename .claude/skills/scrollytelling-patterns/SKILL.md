---
name: scrollytelling-patterns
description: Patterns de scroll-animations utilisés sur ce site (count-up, reveal des steps, Leaflet flyTo, sync clavier/scroll). À charger dès qu'on touche à un effet déclenché au scroll ou au clavier.
---

# Patterns scrollytelling — ExposerHistoire

## Principe d'architecture

Le site combine **3 sources d'événements** qui pilotent les animations :

1. **Scroll souris** → `ScrollTrigger` (GSAP) ajoute `.is-active` sur le `.step` au centre du viewport
2. **Clavier** → `PresentationController` (`js/presentation.js`) émet `presentation:step` quand ← → ↑ ↓
3. **Custom events** → `step:enter` (ID du step actif) écouté par les cartes Leaflet

Les 3 doivent **rester compatibles** : ajouter un effet doit marcher au scroll ET au clavier.

## Pattern 1 — Count-up

```js
function animateCounter(el) {
  if (el.dataset.done) return;
  el.dataset.done = 'true';
  const target = parseFloat(el.dataset.target);
  const duration = parseFloat(el.dataset.duration || '2500');
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(target * eased).toLocaleString('fr-FR');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => e.isIntersecting && animateCounter(e.target));
}, { threshold: 0.4 });
document.querySelectorAll('.counter').forEach((el) => io.observe(el));
```

**Règles** :
- Format français (`toLocaleString('fr-FR')`) → `1 100 000` avec espaces fines
- Une seule animation par compteur (`dataset.done`)
- Threshold 0.4 (ni trop tôt, ni trop tard)

## Pattern 2 — Reveal des `.step`

Le HTML structure : section avec `.scroll__sticky` (sticky position) + `.scroll__steps` (steps empilés).

```css
.step {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.6s, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.step.is-active {
  opacity: 1;
  transform: translateX(0);
  box-shadow: -3px 0 0 var(--accent);  /* barre rouge gauche en surbrillance */
}
```

**`.is-active` est ajouté par 2 sources** :
- `scrollytelling.js` via `ScrollTrigger` (scroll)
- `presentation.js` via `updateActiveStep()` (clavier)

Ne **jamais** ajouter une 3e source — utiliser l'une des 2.

## Pattern 3 — Leaflet flyTo synchronisé avec les steps

```js
document.addEventListener('step:enter', (e) => {
  const id = e.detail.id;
  if (id === 'context-1') map.flyTo([52, 16], 4.2, { duration: 1.5 });
  if (id === 'context-2') map.flyTo([46, -15], 3.5, { duration: 1.5 });
});
```

**Convention des IDs** : préfixe + numéro depuis 1 (ex: `context-1`, `context-2`...). Doit matcher le `stepIdPrefix` dans `SECTIONS` de `presentation.js`.

## Pattern 4 — Layout sticky pour scrollytelling

```html
<section class="section--scroll">
  <div class="scroll__sticky">
    <div class="scroll__viz">
      <div id="map-xxx" class="map"></div>
    </div>
  </div>
  <div class="scroll__steps">
    <article class="step" data-step="xxx-1">...</article>
    <article class="step" data-step="xxx-2">...</article>
  </div>
</section>
```

CSS clés :
```css
.scroll__sticky { position: sticky; top: 0; height: 100vh; }
.scroll__steps {
  width: 38%;
  margin: -100vh 5vw 0 auto;  /* collé à droite, chevauche le sticky */
  pointer-events: none;
}
.step { pointer-events: auto; }
```

Le **voile dégradé** sur `.scroll__viz::after` rend le texte lisible sans masquer la carte :
```css
.scroll__viz::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg,
    rgba(10,10,10,0.15) 0%,
    rgba(10,10,10,0) 35% 50%,
    rgba(10,10,10,0.55) 75%,
    rgba(10,10,10,0.85) 100%);
  pointer-events: none;
  z-index: 400;
}
```

## Pattern 5 — Ajouter une nouvelle section au mode clavier

Dans `js/presentation.js`, ajouter une entrée dans `SECTIONS` :
```js
{ id: 'mon-id', stepCount: N, label: 'Mon titre', stepIdPrefix: 'mon-' }
```

- `id` doit matcher l'`id` HTML de la section
- `stepCount` = nombre d'états interactifs
- `stepIdPrefix` est optionnel — met si tu utilises `step:enter` côté carte (ex: `'mon-1'`, `'mon-2'`...)

## Pattern 6 — Parallax sur image-bleed (ajout session 6)

```js
gsap.fromTo(img,
  { yPercent: -8 },
  { yPercent: 8, ease: 'none',
    scrollTrigger: {
      trigger: img.closest('.image-bleed'),
      start: 'top bottom', end: 'bottom top',
      scrub: true,
    },
  }
);
```

## Pattern 7 — Reveal titre mot-par-mot (ajout session 6)

Decoupe le titre en spans `.word-reveal > .word-reveal__inner`, puis GSAP stagger :
```js
gsap.to(inners, {
  yPercent: 0, opacity: 1, duration: 0.7,
  stagger: 0.08, ease: 'power3.out',
});
```
CSS requis :
```css
.word-reveal { display: inline-block; overflow: hidden; vertical-align: bottom; }
.word-reveal__inner { display: inline-block; will-change: transform, opacity; }
```

## Pattern 8 — Personnages scrollytelling (ajout session 6)

Portrait cadre (3:4) dans `.persos-cine__portrait` a gauche, steps texte a droite.
Le JS `persons.js` ecoute les ScrollTrigger ET les events `step:enter` (prefix `perso-`)
pour changer le portrait dynamiquement. La bordure du cadre change de couleur selon la faction.

## Anti-patterns specifiques a ce projet

- Pas de `fetch()` pour les donnees -- toujours inline dans `index.html` via `window.__DATA__` (compat `file://`)
- Pas de scroll-jacking (le scroll natif doit rester fluide)
- Pas d'animation CSS continue infinie sur fond (sauf grain du Hook) -- distrayant sur projecteur
- Pas de `position: fixed` sur du contenu dans les sections scroll (casse le sticky)
- Pas oublier le z-index : tile-pane Leaflet est a 200, voile a 400, panneau de texte au-dessus
- Pas appeler `.invalidateSize()` Leaflet sauf si vraiment necessaire -- provoque flashes
- Nav laterale : utiliser `rootMargin: '-20% 0px -70% 0px'` + `threshold: 0.05` pour les sections longues

## Where to look

- `js/scrollytelling.js` -- ScrollTrigger setup, emet `step:enter`, parallax, reveal titres
- `js/presentation.js` -- mode clavier, emet `presentation:step` + `step:enter`
- `js/counters.js` -- pattern count-up
- `js/persons.js` -- personnages scrollytelling cinematique
- `js/cinematic.js` -- cinematique de fin (particules canvas + GSAP timeline)
- `js/maps/*.js` -- consomment `step:enter`
- `css/main.css` -- styles `.step`, `.scroll__*`, voile, word-reveal
- `css/sections.css` -- styles sections specifiques (persos-cine, cinematic, etc.)
