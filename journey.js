/* Banco MM2H — "Earth → Kuala Lumpur" descent.
   Vanilla three.js port of chewmunkai/website-side-projects (space-nft) journey:
   space → Earth (day/night/spec/clouds/atmosphere) → zoom presenting Malaysia.
   Exposes window.BancoJourney.setProgress(0..1). */
(function () {
  if (!window.THREE) { return; }
  const THREE = window.THREE;
  const canvas = document.getElementById('journey-canvas');
  if (!canvas) return;
  const base = canvas.getAttribute('data-base') || '../../assets/earth/';

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 240);
  camera.position.set(0.4, 0.2, 9.6);

  const SUN = new THREE.Vector3(0.55, 0.28, 0.78).normalize();
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));
  const dir = new THREE.DirectionalLight(0xffffff, 1.1); dir.position.copy(SUN).multiplyScalar(10); scene.add(dir);

  /* starfield */
  const starGeo = new THREE.BufferGeometry();
  const N = 2000, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 60 + Math.random() * 120, t = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 2 - 1);
    pos[i*3] = r*Math.sin(ph)*Math.cos(t); pos[i*3+1] = r*Math.sin(ph)*Math.sin(t); pos[i*3+2] = r*Math.cos(ph);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.9 }));
  scene.add(stars);

  /* textures */
  const tl = new THREE.TextureLoader();
  const load = (f, srgb) => { const t = tl.load(base + f); if (srgb && 'SRGBColorSpace' in THREE) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const day = load('earth_day.jpg', true), night = load('earth_night.png', true), spec = load('earth_spec.jpg', false), clouds = load('earth_clouds.png', true);

  const earthVert = `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
    void main(){ vUv=uv; vec4 wp=modelMatrix*vec4(position,1.0); vN=normalize(mat3(modelMatrix)*normal); vV=normalize(cameraPosition-wp.xyz); gl_Position=projectionMatrix*viewMatrix*wp; }`;
  const earthFrag = `uniform sampler2D uDay,uNight,uSpec; uniform vec3 uSun; uniform float uOp; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
    void main(){ vec3 N=normalize(vN),L=normalize(uSun),V=normalize(vV);
      float sun=dot(N,L); float d=smoothstep(-0.12,0.3,sun);
      vec3 dc=texture2D(uDay,vUv).rgb, nc=texture2D(uNight,vUv).rgb; nc*=vec3(1.25,1.05,0.7);
      vec3 col=mix(nc*1.3,dc,d)+dc*0.05;
      float ocean=texture2D(uSpec,vUv).r; vec3 H=normalize(L+V);
      float s=pow(max(dot(N,H),0.0),64.0)*ocean*d; col+=vec3(0.7,0.8,0.95)*s*0.22;
      float fr=pow(1.0-max(dot(N,V),0.0),2.6); col+=vec3(0.32,0.56,1.0)*fr*(d*0.6+0.1);
      gl_FragColor=vec4(col,uOp); }`;
  const atmoFrag = `uniform vec3 uSun; uniform float uOp; varying vec3 vN; varying vec3 vV;
    void main(){ vec3 N=normalize(vN),V=normalize(vV),L=normalize(uSun);
      float fr=pow(1.0-abs(dot(N,V)),2.4); float dg=smoothstep(-0.35,0.45,dot(N,L));
      vec3 col=vec3(0.35,0.6,1.0)*fr*(0.35+dg*0.9); gl_FragColor=vec4(col,fr*uOp); }`;

  const earthMat = new THREE.ShaderMaterial({ vertexShader: earthVert, fragmentShader: earthFrag, transparent: true,
    uniforms: { uDay:{value:day}, uNight:{value:night}, uSpec:{value:spec}, uSun:{value:SUN}, uOp:{value:1} } });
  const atmoMat = new THREE.ShaderMaterial({ vertexShader: earthVert, fragmentShader: atmoFrag, transparent: true,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: { uSun:{value:SUN}, uOp:{value:1} } });
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, alphaMap: clouds, transparent: true, depthWrite: false, roughness: 1, metalness: 0, opacity: 0.4 });

  const MAL = 2.95;
  const group = new THREE.Group(); group.rotation.set(0, MAL, 0.41); scene.add(group);
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMat); group.add(earth);
  const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.012, 64, 64), cloudMat); group.add(cloudMesh);
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), atmoMat); atmo.scale.setScalar(1.16); group.add(atmo);

  /* KL marker (rides on the globe, on the Malaysia-facing front) */
  const marker = new THREE.Group(); marker.position.set(-0.203, 0.054, -0.978); group.add(marker);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 16), new THREE.MeshBasicMaterial({ color: 0xF4E8CC, transparent: true, opacity: 0 }));
  marker.add(dot);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.026, 32), new THREE.MeshBasicMaterial({ color: 0xD6B36B, transparent: true, side: THREE.DoubleSide }));
  ring.lookAt(new THREE.Vector3(-0.61, 0.16, -2.93)); marker.add(ring);

  /* ---- cloud deck: procedural puffs that sweep up off the planet and rush
     past the camera to envelop the view (the "dive into clouds" hand-off) ---- */
  function makePuff() {
    const s = 160, cv = document.createElement('canvas'); cv.width = cv.height = s;
    const x = cv.getContext('2d');
    const blob = (cx, cy, r, a) => {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
      g.addColorStop(0.5, 'rgba(255,251,243,' + (a * 0.5) + ')');
      g.addColorStop(1, 'rgba(255,249,238,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
    };
    blob(s * 0.5, s * 0.52, s * 0.5, 0.92);
    for (let i = 0; i < 6; i++) blob(s * (0.3 + Math.random() * 0.4), s * (0.3 + Math.random() * 0.4), s * (0.16 + Math.random() * 0.18), 0.5);
    const t = new THREE.CanvasTexture(cv);
    if ('SRGBColorSpace' in THREE) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const puff = makePuff();
  const cloudDeck = new THREE.Group(); scene.add(cloudDeck);
  const cloudSprites = [];
  for (let i = 0; i < 68; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, opacity: 0, depthWrite: false, depthTest: false, color: 0xf3ece0 }));
    const ang = Math.random() * Math.PI * 2, rad = Math.pow(Math.random(), 1.4) * 1.25;
    sp.userData = { bx: Math.cos(ang) * rad, by: (Math.random() - 0.5) * 2.0, bz: 1.9 + Math.random() * 4.2, sz: 0.4 + Math.random() * 0.85, op: 0.17 + Math.random() * 0.24, ph: Math.random() * 6.28 };
    cloudDeck.add(sp); cloudSprites.push(sp);
  }

  /* easing + helpers */
  const _l = new THREE.Vector3();
  const inv=(a,b,x)=>Math.max(0,Math.min(1,(x-a)/(b-a)));
  const smooth=t=>t*t*t*(t*(t*6-15)+10);                 // smootherstep
  const easeInOut=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const mix=(a,b,t)=>a+(b-a)*t;

  /* sky: space -> high atmosphere -> sky blue -> near-ground haze (almost white) */
  const SKY = [
    [0.00, new THREE.Color('#03040b')],
    [0.50, new THREE.Color('#07173a')],
    [0.74, new THREE.Color('#2664a8')],
    [0.86, new THREE.Color('#7db4e6')],
    [0.94, new THREE.Color('#d6e6f2')],
    [1.00, new THREE.Color('#fdf4e7')],
  ];
  const _bg = new THREE.Color();
  function skyAt(p){
    for (let i=1;i<SKY.length;i++){ if (p<=SKY[i][0]){ const a=SKY[i-1],b=SKY[i]; return _bg.copy(a[1]).lerp(b[1], smooth(inv(a[0],b[0],p))); } }
    return _bg.copy(SKY[SKY.length-1][1]);
  }
  scene.background = SKY[0][1].clone();

  let progress = 0, px = 0, py = 0, tx = 0, ty = 0, frames = 0;
  window.addEventListener('pointermove', e => { tx=(e.clientX/innerWidth)*2-1; ty=-((e.clientY/innerHeight)*2-1); }, { passive:true });

  function frame(t) {
    const p = progress;
    const e = easeInOut(p);                 // single continuous descent — natural fall

    // smooth pointer parallax (eased toward target), tapering as we land
    px += (tx - px) * 0.06; py += (ty - py) * 0.06;
    const par = mix(0.16, 0.015, e);

    // continuous dolly from orbit toward Malaysia; we stop at a crisp full-disc
    // approach (not skimming the surface, which read as a blank void) — the
    // final hand-off to the city is carried by the warm light bloom + photo.
    const dist = mix(9.6, 1.9, e);
    camera.position.set(px * par, py * par, dist);
    _l.set(px * par * 0.4, py * par * 0.4, 0);
    camera.lookAt(_l);

    // a dense field of clouds streams toward + past the camera as we drop — each
    // puff swells then fades as it rushes by, so it reads as physically flying
    // down through thick cloud before the warm bloom washes into the city hero.
    const cFade = smooth(inv(0.42, 0.9, p));
    const stream = smooth(inv(0.45, 1.0, p)) * 3.9;
    for (let i = 0; i < cloudSprites.length; i++) {
      const sp = cloudSprites[i], u = sp.userData;
      const effZ = u.bz - stream;
      const passFade = Math.max(0, Math.min(1, (effZ - 1.45) / 0.85));   // fade out as it sweeps past us
      sp.position.set(u.bx + Math.sin(t * 0.00018 + u.ph) * 0.07, u.by + Math.cos(t * 0.00015 + u.ph) * 0.06, effZ);
      sp.scale.set(u.sz, u.sz, 1);
      sp.material.opacity = cFade * u.op * passFade;
    }

    // globe gently turns to keep Malaysia centred as we drop in
    group.rotation.set(0, MAL - (1 - smooth(inv(0, 0.85, p))) * 0.3, 0.41);

    // atmosphere thickens, sky brightens, stars + clouds dissolve as we enter air
    const air = smooth(inv(0.42, 0.82, p));
    skyAt(p);
    atmoMat.uniforms.uOp.value = mix(0.65, 2.1, e);
    stars.material.opacity = 0.9 * (1 - smooth(inv(0.4, 0.7, p)));
    cloudMat.opacity = mix(0.42, 0.0, air);
    cloudMesh.rotation.y += 0.0006;
    stars.rotation.y += 0.0002;

    // KL beacon pulses as the city comes into reach, then fades on touchdown
    const ph = (t * 0.0011) % 1;
    ring.scale.setScalar(1 + ph * 2.6);
    ring.material.opacity = (1 - ph) * smooth(inv(0.4, 0.62, p)) * (1 - smooth(inv(0.9, 1, p)));
    dot.material.opacity = smooth(inv(0.4, 0.6, p));

    renderer.render(scene, camera);
    frames++;
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  let raf = requestAnimationFrame(frame);
  window.BancoJourney = {
    setProgress(p){ progress = Math.max(0, Math.min(1, p)); },
    stop(){ cancelAnimationFrame(raf); raf = 0; },
    start(){ if(!raf) raf = requestAnimationFrame(frame); },
    tick(){ frame(performance.now()); },
    info(){ return { tri: renderer.info.render.triangles, calls: renderer.info.render.calls, frames: frames, geos: renderer.info.memory.geometries, w: canvas.width, h: canvas.height, dayLoaded: day.image && day.image.width || 0 }; }
  };
})();
