/* ============================================================================
   Banco MM2H — Body upgrade interactions.
   Builds on the existing engine in site.js (Lenis, GSAP/ScrollTrigger, cursor,
   magnetic, reveals). Adds: clip reveals, sticky number-led hub, pinned
   horizontal pathways, interactive tiers, scrubbed feature media, sticky
   process timeline, draggable life filmstrip.
   ========================================================================== */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const G = window.gsap, ST = window.ScrollTrigger;
  const has = G && ST && !reduced;

  function ready(fn){ if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  /* ---- clip-path line reveals --------------------------------------- */
  function initClips(){
    const els = document.querySelectorAll('.clip-line');
    if (!has){ els.forEach(e=>e.style.clipPath='none'); return; }
    els.forEach(el=>{
      G.fromTo(el,{clipPath:'inset(0 0 110% 0)'},{clipPath:'inset(0 0 -5% 0)',duration:1.1,ease:'expo.out',
        scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    });
  }

  /* ---- HUB · sticky number-led showcase ----------------------------- */
  function initHub(){
    const sec = document.querySelector('.hubx'); if (!sec) return;
    const rows = [...sec.querySelectorAll('.hubx__row')];
    const icon = sec.querySelector('.hubx__icon');
    const photo = sec.querySelector('.hubx__photo');
    const stageT = sec.querySelector('.hubx__stagetitle .t');
    const cur = sec.querySelector('.hubx__count .cur');
    if (!rows.length) return;
    let active = -1;
    const set = (i)=>{
      if (i===active) return; active = i;
      const r = rows[i];
      rows.forEach((x,k)=>x.classList.toggle('is-active',k===i));
      if (cur) cur.textContent = String(i+1).padStart(2,'0');
      if (icon){
        icon.classList.add('swap');
        setTimeout(()=>{ icon.src = r.dataset.icon; icon.classList.remove('swap'); },250);
      }
      if (photo && r.dataset.img){
        photo.classList.add('swap');
        setTimeout(()=>{ photo.src = r.dataset.img; photo.classList.remove('swap'); },250);
      }
      if (stageT){
        stageT.classList.add('swap');
        setTimeout(()=>{ stageT.textContent = r.dataset.title; stageT.classList.remove('swap'); },220);
      }
    };
    set(0);
    rows.forEach((r,i)=>{
      r.addEventListener('mouseenter',()=>set(i));
      if (has) ST.create({trigger:r,start:'top 60%',end:'bottom 60%',onToggle:s=>{ if(s.isActive) set(i); }});
    });
  }

  /* ---- PATHWAYS · pinned horizontal scroll -------------------------- */
  function initPathways(){
    const sec = document.querySelector('.phz'); if (!sec) return;
    const track = sec.querySelector('.phz__track');
    const rails = [...sec.querySelectorAll('.phz__rail i')];
    const hintBar = sec.querySelector('.phz__hint .bar i');
    const small = window.innerWidth < 760;
    if (!has || small){ sec.classList.add('no-pin'); if (has) initPathwaysMobile(sec); return; }
    const dist = ()=> Math.max(0, track.scrollWidth - window.innerWidth);
    G.to(track,{ x:()=>-dist(), ease:'none',
      scrollTrigger:{ trigger:sec, start:'top top', end:()=>'+='+dist(), scrub:0.5,
        pin:true, anticipatePin:1, invalidateOnRefresh:true,
        onUpdate:self=>{ const p=self.progress; rails.forEach(r=>r.style.transform='scaleX('+p+')'); if(hintBar) hintBar.style.transform='scaleX('+p+')'; } }
    });
  }

  /* ---- PATHWAYS (mobile) · vertical scroll choreography ------------- */
  function initPathwaysMobile(sec){
    const intro = sec.querySelector('.phz__intro');
    const hintBar = sec.querySelector('.phz__hint .bar i');
    if (intro) G.from([...intro.children], {y:30,opacity:0,duration:.7,stagger:.08,ease:'expo.out',
      scrollTrigger:{trigger:intro,start:'top 85%',once:true}});
    if (hintBar) G.fromTo(hintBar,{scaleX:0},{scaleX:1,ease:'none',
      scrollTrigger:{trigger:sec,start:'top 70%',end:'bottom bottom',scrub:0.5}});
    sec.querySelectorAll('.phz__panel').forEach(panel=>{
      const img  = panel.querySelector('image-slot');
      const big  = panel.querySelector('.phz__big');
      const rail = panel.querySelector('.phz__rail i');
      G.from(panel,{y:46,opacity:0,duration:.85,ease:'expo.out',
        scrollTrigger:{trigger:panel,start:'top 86%',once:true}});
      if (img)  G.fromTo(img,{scale:1.16,yPercent:-5},{scale:1,yPercent:5,ease:'none',
        scrollTrigger:{trigger:panel,start:'top bottom',end:'bottom top',scrub:true}});
      if (big)  G.fromTo(big,{yPercent:34},{yPercent:-22,ease:'none',
        scrollTrigger:{trigger:panel,start:'top bottom',end:'bottom top',scrub:true}});
      if (rail) G.fromTo(rail,{scaleX:0},{scaleX:1,ease:'none',
        scrollTrigger:{trigger:panel,start:'top 78%',end:'bottom 62%',scrub:0.4}});
    });
  }

  /* ---- TIERS · interactive highlight -------------------------------- */
  function initTiers(){
    const sec = document.querySelector('.tiers'); if (!sec) return;
    const tabs = [...sec.querySelectorAll('.tiers__tab')];
    const tiers = [...sec.querySelectorAll('.tier')];
    const focus = (key)=>{
      tabs.forEach(t=>t.classList.toggle('is-on',t.dataset.tier===key));
      tiers.forEach(t=>{
        const on = key==='all' || t.dataset.tier===key;
        t.classList.toggle('is-on', on && key!=='all');
        t.classList.toggle('is-dim', !on && key!=='all');
      });
    };
    tabs.forEach(t=>t.addEventListener('click',()=>focus(t.dataset.tier)));
    focus('all');
  }

  /* ---- FEATURE · scrubbed media + parallax number ------------------- */
  function initFeatures(){
    if (!has) return;
    document.querySelectorAll('.feat').forEach(sec=>{
      const img = sec.querySelector('.scrubimg');
      const num = sec.querySelector('.feat__num');
      if (img) G.fromTo(img,{scale:1.18,yPercent:-6},{scale:1,yPercent:6,ease:'none',
        scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});
      if (num) G.fromTo(num,{yPercent:24},{yPercent:-24,ease:'none',
        scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});
    });
  }

  /* ---- PROCESS · sticky timeline ------------------------------------ */
  function initProcess(){
    const sec = document.querySelector('.proc'); if (!sec) return;
    const steps = [...sec.querySelectorAll('.proc__step')];
    const cur = sec.querySelector('.proc__bignum .cur');
    const title = sec.querySelector('.proc__curtitle');
    const line = sec.querySelector('.proc__line i');
    if (!steps.length) return;
    let active=-1;
    const set=(i)=>{
      if(i===active) return; active=i;
      steps.forEach((s,k)=>s.classList.toggle('is-active',k===i));
      if(cur) cur.textContent=String(i+1).padStart(2,'0');
      if(title) title.textContent=steps[i].dataset.title||'';
    };
    set(0);
    if (!has) return;
    steps.forEach((s,i)=>ST.create({trigger:s,start:'top 55%',end:'bottom 55%',onToggle:t=>{if(t.isActive) set(i);}}));
    if (line) G.fromTo(line,{scaleY:0},{scaleY:1,ease:'none',
      scrollTrigger:{trigger:sec.querySelector('.proc__steps'),start:'top 60%',end:'bottom 70%',scrub:0.4}});
  }

  /* ---- LIFE · draggable filmstrip ----------------------------------- */
  function initFilm(){
    const sec = document.querySelector('.film'); if (!sec) return;
    const vp = sec.querySelector('.film__viewport');
    const track = sec.querySelector('.film__track');
    const prog = sec.querySelector('.film__progress .bar i');
    if (!vp || !track) return;
    let x=0, max=0, down=false, startX=0, startPos=0, vel=0, last=0, raf=null;
    const measure=()=>{ max = Math.min(0, vp.clientWidth - track.scrollWidth - 0); };
    const clamp=(v)=>Math.max(max, Math.min(0, v));
    const apply=()=>{
      track.style.transform='translate3d('+x+'px,0,0)';
      if (prog){ const p = max===0?0:x/max; prog.style.transform='translateX('+(p*230)+'%)'; }
    };
    const momentum=()=>{
      if (Math.abs(vel)<0.1){ raf=null; return; }
      x = clamp(x+vel); vel*=0.92; apply(); raf=requestAnimationFrame(momentum);
    };
    measure(); apply();
    window.addEventListener('resize',()=>{ measure(); x=clamp(x); apply(); });
    if (window.ST||ST) setTimeout(()=>{ measure(); apply(); },400);

    const pos=(e)=> e.touches?e.touches[0].clientX:e.clientX;
    vp.addEventListener('pointerdown',(e)=>{
      down=true; vp.classList.add('is-drag'); startX=pos(e); startPos=x; vel=0; last=x;
      if(raf){cancelAnimationFrame(raf);raf=null;} vp.setPointerCapture&&vp.setPointerCapture(e.pointerId);
    });
    window.addEventListener('pointermove',(e)=>{
      if(!down) return;
      x = clamp(startPos + (pos(e)-startX)); vel = x-last; last=x; apply();
    });
    const up=()=>{ if(!down) return; down=false; vp.classList.remove('is-drag'); if(Math.abs(vel)>0.5) raf=requestAnimationFrame(momentum); };
    window.addEventListener('pointerup',up);
    window.addEventListener('pointercancel',up);
    vp.addEventListener('wheel',(e)=>{
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)){ e.preventDefault(); x=clamp(x-e.deltaX); apply(); }
    },{passive:false});
    vp.addEventListener('dragstart',e=>e.preventDefault());
  }

  /* ---- mobile nav menu (hamburger) ---------------------------------- */
  function initNavMenu(){
    const nav = document.querySelector('.nav'); if (!nav) return;
    const burger = nav.querySelector('.nav__burger'); if (!burger) return;
    const setOpen = (o)=>{ nav.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o?'true':'false'); };
    burger.addEventListener('click', ()=> setOpen(!nav.classList.contains('menu-open')));
    nav.querySelectorAll('.nav__links a').forEach(a=> a.addEventListener('click', ()=> setOpen(false)));
    window.addEventListener('keydown', e=>{ if (e.key==='Escape') setOpen(false); });
    window.addEventListener('resize', ()=>{ if (window.innerWidth>860) setOpen(false); });
  }

  function boot(){
    initNavMenu();
    initClips(); initHub(); initTiers(); initProcess(); initFilm();
    initFeatures(); initPathways();
    if (G && ST){ ST.refresh(); setTimeout(()=>ST.refresh(), 600); }
  }
  ready(()=> setTimeout(boot, 60));
})();
