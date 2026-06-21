/* Banco MM2H — immersive light site interactions + Earth→KL journey wiring.
   Techniques adapted from chewmunkai/website-side-projects (space-nft). */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const G = window.gsap;
  if (G && window.ScrollTrigger) G.registerPlugin(ScrollTrigger);

  let lenis = null;
  function initLenis() {
    if (reduced || !window.Lenis) return;
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (G) { lenis.on('scroll', () => ScrollTrigger.update()); G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0); }
    else { const r = t => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
    document.documentElement.classList.add('lenis');
    window.__lenis = lenis;
  }
  function scrollTo(sel) { const el = document.querySelector(sel); if (!el) return; lenis ? lenis.scrollTo(el, { offset: -10 }) : el.scrollIntoView({ behavior: 'smooth' }); }

  /* split text */
  function buildSplit(el) {
    const text = el.textContent.trim(); el.textContent = ''; el.setAttribute('aria-label', text);
    const inners = [];
    text.split(/(\s+)/).forEach(tok => {
      if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(' ')); return; }
      const m = document.createElement('span'); m.className = 'split-mask';
      const i = document.createElement('span'); i.className = 'split-inner'; i.textContent = tok; i.setAttribute('aria-hidden', 'true');
      m.appendChild(i); el.appendChild(m); inners.push(i);
    });
    return inners;
  }
  function animateSplit(inners, opts) { if (G && !reduced) G.from(inners, Object.assign({ yPercent: 118, duration: 1, ease: 'expo.out', stagger: 0.05 }, opts)); }

  function initReveals() {
    document.querySelectorAll('[data-split]').forEach(el => {
      const inners = buildSplit(el);
      if (el.hasAttribute('data-split-hero')) { el._inners = inners; return; }
      if (!reduced && G) animateSplit(inners, { scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
    if (reduced || !G) document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
    else document.querySelectorAll('.reveal').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => setTimeout(() => el.classList.add('in'), parseInt(el.dataset.delay || 0)) }));
    document.querySelectorAll('[data-count]').forEach(el => {
      const end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', dec = (el.dataset.dec | 0);
      const set = v => el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suffix;
      set(0);
      if (reduced || !G) { set(end); return; }
      const o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => G.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => set(o.v) }) });
    });
  }

  function initNav() {
    const nav = document.querySelector('.nav'); if (!nav) return;
    const hero = document.querySelector('.vhero');
    // The fixed nav stays out of the way through the cinematic intro + the video
    // hero (which carries its own glass nav), then slides in solid over the
    // light content. Avoids a double-nav and a white-logo-on-white seam.
    const on = () => {
      let pastHero;
      if (hero) { const r = hero.getBoundingClientRect(); pastHero = r.bottom <= 80; }
      else pastHero = window.scrollY > window.innerHeight * 0.85;
      nav.classList.toggle('nav--hidden', !pastHero);
      nav.classList.toggle('scrolled', pastHero);
    };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on, { passive: true });
    on();
    document.querySelectorAll('[data-scroll-to]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); scrollTo(a.getAttribute('data-scroll-to')); }));
  }

  function initMagnetic() {
    if (!fine || !G) return;
    document.querySelectorAll('.magnetic').forEach(el => {
      const label = el.querySelector('.btn__l') || el.firstElementChild, s = parseFloat(el.dataset.strength || 0.4);
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2); G.to(el, { x: x * s, y: y * s, duration: 0.6, ease: 'power3' }); if (label) G.to(label, { x: x * s * 0.35, y: y * s * 0.35, duration: 0.6, ease: 'power3' }); });
      el.addEventListener('mouseleave', () => { G.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }); if (label) G.to(label, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }); });
    });
  }

  function initTilt() {
    if (!fine) return;
    document.querySelectorAll('.pcard').forEach(card => {
      const img = card.querySelector('img');
      card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; card.style.transform = `perspective(700px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-4px)`; if (img) img.style.transform = `translateZ(38px) translate(${px * 9}px,${py * 9}px)`; });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; if (img) img.style.transform = 'translateZ(38px)'; });
    });
  }

  function initCursor() {
    if (!fine || !G) return;
    const root = document.createElement('div'); root.className = 'cursor';
    root.innerHTML = '<div class="cursor__ring"><span class="cursor__label"></span></div><div class="cursor__dot"></div>';
    document.body.appendChild(root); document.body.classList.add('cursor-on');
    const ring = root.querySelector('.cursor__ring'), dot = root.querySelector('.cursor__dot'), label = root.querySelector('.cursor__label');
    G.set([ring, dot], { xPercent: -50, yPercent: -50 });
    const xR = G.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }), yR = G.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    const xD = G.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' }), yD = G.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    requestAnimationFrame(() => root.classList.add('ready'));
    window.addEventListener('mousemove', e => { xR(e.clientX); yR(e.clientY); xD(e.clientX); yD(e.clientY); }, { passive: true });
    window.addEventListener('mouseover', e => {
      const t = e.target.closest('a,button,[data-cursor],.pcard,.pathc'), lab = t && t.getAttribute('data-cursor');
      G.to(ring, { scale: t ? (lab ? 2.3 : 1.8) : 1, backgroundColor: lab ? '#C9A24A' : 'rgba(255,255,255,0)', borderColor: t ? 'rgba(20,40,30,0.7)' : 'rgba(20,40,30,0.45)', duration: 0.4, ease: 'power3' });
      G.to(dot, { scale: t ? 0 : 1, duration: 0.3 });
      label.textContent = lab || ''; root.classList.toggle('has-label', !!lab);
    }, { passive: true });
    window.addEventListener('mousedown', () => G.to(ring, { scale: 0.8, duration: 0.2 }));
    window.addEventListener('mouseup', () => G.to(ring, { scale: 1, duration: 0.3 }));
  }

  /* ---- Earth → KL journey wiring ---- */
  const clamp = (a, b, x) => Math.max(0, Math.min(1, (x - a) / (b - a)));
  function initJourney() {
    const sec = document.querySelector('.journey'); if (!sec) return;
    const jhero = sec.querySelector('.jhero'), flash = sec.querySelector('.journey__flash'),
          rail = sec.querySelector('.journey__rail i'), cue = sec.querySelector('.scrollcue'),
          beats = Array.prototype.slice.call(sec.querySelectorAll('.beat'));
    const beatEls = beats;
    // the KL video hero overlaps the journey's tail (CSS margin-top:-100vh) so it
    // pins and reveals in place; we cross-fade its stage in over the final approach
    // so there's no empty white slide between the two sections.
    const vstage = document.querySelector('.vhero__stage');
    const apply = p => {
      if (window.BancoJourney) window.BancoJourney.setProgress(p);
      if (rail) rail.style.transform = 'scaleY(' + p + ')';
      if (jhero) jhero.classList.toggle('gone', p > 0.07);
      if (cue) cue.classList.toggle('hide', p > 0.04);
      // a brief warm bloom grows over the final approach; the city hero cross-fades
      // in underneath it, so the hand-off is one continuous wash of light — never a
      // flat white wall that lingers for a screen of scrolling.
      if (flash) flash.style.opacity = String(clamp(0.86, 1.0, p) * 0.82);
      if (vstage) vstage.style.opacity = p < 0.999 ? '0' : '1';
      const stage = p < 0.16 ? -1 : p < 0.46 ? 0 : p < 0.7 ? 1 : p < 0.9 ? 2 : -1;
      beatEls.forEach((b, i) => b.classList.toggle('active', i === stage));
    };
    if (reduced || !G) { apply(0); return; }
    ScrollTrigger.create({
      trigger: sec, start: 'top top', end: 'bottom bottom',
      onUpdate: self => apply(self.progress),
      onLeave: () => window.BancoJourney && window.BancoJourney.stop(),
      onEnterBack: () => window.BancoJourney && window.BancoJourney.start(),
    });
    apply(0);
  }

  /* ---- scroll progress bar ---- */
  function initProgress() {
    const bar = document.querySelector('.progress i'); if (!bar) return;
    const set = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')'; };
    window.addEventListener('scroll', set, { passive: true }); set();
  }

  /* ---- parallax on flagged media ---- */
  function initParallax() {
    if (reduced || !G) return;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const amt = parseFloat(el.dataset.parallax) || 12;
      G.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---- hero title pointer parallax ---- */
  function initHeroParallax() {
    if (!fine || !G) return;
    const layers = document.querySelectorAll('.jhero [data-depth]');
    if (!layers.length) return;
    window.addEventListener('mousemove', e => {
      const dx = (e.clientX / innerWidth - 0.5), dy = (e.clientY / innerHeight - 0.5);
      layers.forEach(l => { const d = parseFloat(l.dataset.depth) || 0.4; G.to(l, { x: -dx * 40 * d, y: -dy * 30 * d, duration: 0.8, ease: 'power3' }); });
    }, { passive: true });
  }

  function startHero() {
    document.querySelectorAll('[data-split-hero]').forEach((el, i) => { if (el._inners) animateSplit(el._inners, { delay: 0.15 + i * 0.1, stagger: 0.06, duration: 1.05 }); });
    if (G && !reduced) G.from('.jhero__fade', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, delay: 0.45 });
  }

  /* ---- video hero: char-by-char heading + staggered fades + cloud→video veil ---- */
  function initVHero() {
    const hero = document.querySelector('.vhero'); if (!hero) return;
    const head = hero.querySelector('[data-vhead]'), veil = hero.querySelector('.vhero__veil');
    const chars = [];
    if (head) {
      const lines = head.textContent.split('\n').map(l => l.trim()).filter(l => l.length);
      head.textContent = '';
      lines.forEach(line => {
        const ln = document.createElement('span'); ln.className = 'ln';
        line.split(' ').forEach((word, wi, ws) => {
          const wd = document.createElement('span'); wd.className = 'wd';
          Array.prototype.forEach.call(word, c => {
            const s = document.createElement('span'); s.className = 'ch';
          s.textContent = c === ' ' ? ' ' : c;
            wd.appendChild(s); chars.push(s);
          });
          ln.appendChild(wd);
          if (wi < ws.length - 1) ln.appendChild(document.createTextNode(' '));
        });
        head.appendChild(ln);
      });
    }
    const fades = Array.prototype.slice.call(hero.querySelectorAll('[data-vfade]'));
    fades.forEach(f => f.classList.add('vfade'));
    let played = false;
    const play = () => {
      if (played) return; played = true;
      if (reduced) { chars.forEach(c => c.classList.add('in')); fades.forEach(f => f.classList.add('in')); return; }
      chars.forEach((c, i) => setTimeout(() => c.classList.add('in'), 200 + i * 30));
      fades.forEach(f => setTimeout(() => f.classList.add('in'), parseInt(f.dataset.vfade || 0)));
    };
    // As the hero scrolls in you keep dropping: the warm veil thins, the cloud
    // puffs drift down and part, and the city video eases from a slight push to
    // rest — one continuous, scroll-synced descent that lands you in Kuala Lumpur.
    const bg = hero.querySelector('.vhero__bg');
    const pad = hero.querySelector('.vhero__pad');
    const stage = hero.querySelector('.vhero__stage');
    const clouds = Array.prototype.slice.call(hero.querySelectorAll('.vcloud'));
    const ss = (x, a, b) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    // The hero overlaps + pins over the journey's tail; this scrubs the pinned
    // scroll so the city is revealed full-screen quickly: warm veil clears, cloud
    // puffs drift down + part, the video eases from a push to rest, the UI emerges —
    // then you dwell in KL. The whole white passage is short and always moving.
    const reveal = pr => {
      // the journey cross-fades the stage in by p=1; from there keep it solid
      if (stage) stage.style.opacity = pr > 0.004 ? '1' : '0';
      if (veil) veil.style.opacity = String(1 - ss(pr, 0, 0.26));
      if (bg) bg.style.transform = 'scale(' + (1.12 - 0.12 * ss(pr, 0, 0.65)).toFixed(3) + ')';
      if (pad) pad.style.opacity = String(ss(pr, 0.22, 0.5));
      const co = 1 - ss(pr, 0, 0.45);
      clouds.forEach(c => {
        const sp = parseFloat(c.dataset.sp || 1), bs = parseFloat(c.dataset.s || 1);
        c.style.opacity = String(co);
        c.style.transform = 'translate3d(0,' + (ss(pr, 0, 0.5) * 60 * sp).toFixed(1) + 'vh,0) scale(' + (bs * (1 + pr * 0.7)).toFixed(3) + ')';
      });
      if (pr > 0.1) play();
    };
    if (G && window.ScrollTrigger && !reduced) {
      ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.5, onUpdate: self => reveal(self.progress) });
      reveal(0);
    } else {
      if (stage) stage.style.opacity = '1';
      if (veil) veil.style.opacity = '0';
      if (pad) pad.style.opacity = '1';
      clouds.forEach(c => { c.style.opacity = '0'; });
      if (bg) bg.style.transform = 'none';
      play();
    }
  }

  function boot() {
    initLenis(); initReveals(); initNav(); initMagnetic(); initTilt(); initCursor(); initJourney(); initVHero(); initProgress(); initParallax(); initHeroParallax(); startHero();
    if (G) ScrollTrigger.refresh();
    window.__bancoBooted = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
