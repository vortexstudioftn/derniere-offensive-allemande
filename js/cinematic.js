/* ============================================================
   CINÉMATIQUE FINALE — Explosion cinétique
   Particules canvas + GSAP timeline
   ============================================================ */
(function () {
  const section = document.querySelector('.section--cinematic');
  if (!section) return;

  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  // --- Canvas resize ---
  function resize() {
    canvas.width = section.offsetWidth * window.devicePixelRatio;
    canvas.height = section.offsetHeight * window.devicePixelRatio;
    canvas.style.width = section.offsetWidth + 'px';
    canvas.style.height = section.offsetHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Particles ---
  const particles = [];
  const PARTICLE_COUNT = 120;
  const centerX = () => section.offsetWidth / 2;
  const centerY = () => section.offsetHeight / 2;

  let animationPhase = 'converge'; // converge | explode | ambient
  let phaseStartTime = 0;

  function createParticle(i) {
    const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
    const dist = 300 + Math.random() * 400;
    return {
      x: centerX() + Math.cos(angle) * dist,
      y: centerY() + Math.sin(angle) * dist,
      targetX: centerX(),
      targetY: centerY(),
      vx: 0,
      vy: 0,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.3 + Math.random() * 0.7,
      color: Math.random() > 0.3 ? '192,57,43' : '232,230,225',
      angle: angle,
      speed: 0.8 + Math.random() * 1.2,
      life: 1,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle(i));
  }

  function updateParticles(dt) {
    const cx = centerX();
    const cy = centerY();

    particles.forEach((p) => {
      if (animationPhase === 'converge') {
        const dx = cx - p.x;
        const dy = cy - p.y;
        p.x += dx * 0.02 * p.speed;
        p.y += dy * 0.02 * p.speed;
        p.alpha = Math.min(1, p.alpha + 0.005);
      } else if (animationPhase === 'explode') {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (dx / dist) * 8;
        p.vy += (dy / dist) * 8;
        p.x += p.vx * 0.1;
        p.y += p.vy * 0.1;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha *= 0.985;
      } else {
        // ambient: slow orbit
        p.angle += 0.003 * p.speed;
        const orbitDist = 200 + p.size * 50;
        const tx = cx + Math.cos(p.angle) * orbitDist;
        const ty = cy + Math.sin(p.angle) * orbitDist;
        p.x += (tx - p.x) * 0.01;
        p.y += (ty - p.y) * 0.01;
        p.alpha = 0.15 + Math.sin(Date.now() * 0.001 + p.angle) * 0.1;
      }
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, section.offsetWidth, section.offsetHeight);
    particles.forEach((p) => {
      if (p.alpha <= 0.01) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha * 0.15})`;
      ctx.fill();
    });
  }

  let rafId;
  let lastTime = 0;
  function loop(time) {
    const dt = time - lastTime;
    lastTime = time;
    updateParticles(dt);
    drawParticles();
    rafId = requestAnimationFrame(loop);
  }

  function setPhase(phase) {
    animationPhase = phase;
    phaseStartTime = Date.now();
  }

  // --- GSAP Timeline (triggered on scroll into view) ---
  function buildTimeline() {
    const tl = gsap.timeline({ paused: true });
    const names = section.querySelector('.cine__names');
    const nameEls = section.querySelectorAll('.cine__name');
    const label = section.querySelector('.cine__label');
    const classEl = section.querySelector('.cine__class');
    const classline = section.querySelector('.cine__classline');
    const sources = section.querySelector('.cine__sources');
    const sourceItems = section.querySelectorAll('.cine__sources-list li');
    const sourcesTitle = section.querySelector('.cine__sources-title');
    const quote = section.querySelector('.cine__quote');
    const quoteP = section.querySelector('.cine__quote blockquote p');
    const quoteCite = section.querySelector('.cine__quote cite');
    const end = section.querySelector('.cine__end');
    const endline = section.querySelector('.cine__endline');

    // Phase 1: Convergence + noms explosent
    tl.set(names, { opacity: 1, pointerEvents: 'auto' });
    tl.from(label, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
    });
    tl.call(() => setPhase('explode'), null, '+=0.3');
    tl.from(nameEls[0], {
      opacity: 0,
      scale: 0,
      rotateX: 90,
      rotateZ: -15,
      z: -500,
      duration: 1,
      ease: 'back.out(1.7)',
    }, '+=0.1');
    tl.from(nameEls[1], {
      opacity: 0,
      scale: 0,
      rotateX: -90,
      rotateZ: 15,
      z: -500,
      duration: 1,
      ease: 'back.out(1.7)',
    }, '-=0.6');

    // Phase 2: classe
    tl.to(names, { opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=1.2');
    tl.set(classEl, { opacity: 1, pointerEvents: 'auto' });
    tl.call(() => setPhase('ambient'));
    tl.from(classline, {
      opacity: 0,
      scale: 1.8,
      letterSpacing: '1.5em',
      duration: 1.2,
      ease: 'expo.out',
    });

    // Phase 3: Sources orbitent
    tl.to(classEl, { opacity: 0, duration: 0.5 }, '+=1.5');
    tl.set(sources, { opacity: 1, pointerEvents: 'auto' });
    tl.from(sourcesTitle, {
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: 'power2.out',
    });
    tl.from(sourceItems, {
      opacity: 0,
      rotateY: 90,
      x: () => (Math.random() - 0.5) * 600,
      y: () => (Math.random() - 0.5) * 200,
      z: () => -200 - Math.random() * 300,
      scale: 0.5,
      duration: 0.8,
      stagger: 0.12,
      ease: 'back.out(1.2)',
    });

    // Phase 4: Citation
    tl.to(sources, { opacity: 0, duration: 0.6 }, '+=1.8');
    tl.set(quote, { opacity: 1, pointerEvents: 'auto' });
    tl.from(quoteP, {
      opacity: 0,
      scale: 0.7,
      y: 30,
      duration: 1.2,
      ease: 'power3.out',
    });
    tl.from(quoteCite, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4');

    // Phase 5: FIN
    tl.to(quote, { opacity: 0, duration: 0.8 }, '+=2.5');
    tl.set(end, { opacity: 1, pointerEvents: 'auto' });
    tl.from(endline, {
      opacity: 0,
      scale: 4,
      rotateX: 45,
      duration: 1.5,
      ease: 'expo.out',
    });
    tl.to(endline, {
      textShadow: '0 0 100px rgba(192,57,43,0.8), 0 0 200px rgba(192,57,43,0.4)',
      duration: 1,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1,
    });

    return tl;
  }

  // --- Trigger on scroll ---
  let timeline;
  let hasPlayed = false;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: function () {
      if (hasPlayed) return;
      hasPlayed = true;
      rafId = requestAnimationFrame(loop);
      setPhase('converge');
      timeline = buildTimeline();
      setTimeout(() => timeline.play(), 800);
    },
  });
})();
