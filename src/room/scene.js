import * as THREE from 'three';

export function buildScene(canvas, onClickObject, onZoneChange) {
  // ── RENDERER ──────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c0b0a);
  scene.fog = new THREE.FogExp2(0x0c0b0a, 0.045);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 80);
  camera.position.set(0, 4, 11);

  // ── LIGHTING ──────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x1a1814, 2.2));
  const sun = new THREE.DirectionalLight(0xfff4e0, 0.7);
  sun.position.set(2, 10, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12;
  scene.add(sun);
  scene.add(Object.assign(new THREE.DirectionalLight(0xffa060, 0.18), { position: new THREE.Vector3(-6, 5, -4) }));

  const ZONE_COLORS = [0xe8c97a, 0x7eb8f7, 0xff8c69, 0x69f0ae, 0xc9a0f5];
  const ZONE_LIGHT_POS = [[-4,5,2],[4.5,5,2],[0,5,-3],[5.5,5,-3],[-5.5,5,-3]];
  const zoneLights = ZONE_LIGHT_POS.map((p, i) => {
    const l = new THREE.PointLight(ZONE_COLORS[i], 0, 9, 1.5);
    l.position.set(...p); scene.add(l); return l;
  });

  const lampLight = new THREE.PointLight(0xffb347, 1.4, 5, 2);
  lampLight.position.set(-7, 3.8, -5.5); scene.add(lampLight);
  const monGlow = new THREE.PointLight(0x4a8eff, 0.6, 2.5, 2);
  monGlow.position.set(-3.5, 1.9, -6.5); scene.add(monGlow);

  // ── MATERIALS ─────────────────────────────────────────
  const M = {
    floorWood: mat(0x1a130d), wallPaint: mat(0x111014), ceiling: mat(0x0d0c10),
    rug: mat(0x1c1728), rugBorder: mat(0x2a2038), baseboard: mat(0x1e1c28),
    deskWood: mat(0x2d1f0f), deskWoodLight: mat(0x3d2a14), shelfWood: mat(0x241a0e),
    metalDark: mat(0x252535), metalMid: mat(0x33334a), chrome: mat(0x4a4a60),
    chairFabric: mat(0x1a1528), chairLeather: mat(0x0f0c18), couchFabric: mat(0x2e2040),
    laptopBody: mat(0x28283a), screenOn: new THREE.MeshBasicMaterial({ color: 0x2a5caa }),
    lampShade: new THREE.MeshLambertMaterial({ color: 0xd4a060, side: THREE.DoubleSide }),
    lampBase: mat(0x3a2a1a), plant: mat(0x1e5c28), plantDark: mat(0x163d1a),
    pot: mat(0x6b4a35), potDark: mat(0x3e2820),
    volleyball: mat(0xf0e060), vbLine: new THREE.MeshBasicMaterial({ color: 0x333300 }),
    racketFrame: mat(0x2d7a1f), racketHandle: mat(0x4a2010),
    racketString: new THREE.MeshBasicMaterial({ color: 0x99dd44 }),
    sportsBag: mat(0x1a237e), corkboard: mat(0x8b6340), pin: mat(0xe8543a),
    wallAccent: mat(0x0e0d12),
    books: [0xc0392b,0x1a6b9a,0x2e7d32,0x8e44ad,0xd35400,0x16a085,0x7f8c8d,0x2c3e50].map(mat),
  };
  function mat(c) { return new THREE.MeshLambertMaterial({ color: c }); }

  // ── HELPERS ───────────────────────────────────────────
  const clickables = [];
  function add(m) { scene.add(m); return m; }
  function box(w,h,d,m,x,y,z,ry=0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m);
    mesh.position.set(x,y,z); mesh.rotation.y = ry;
    mesh.castShadow = true; mesh.receiveShadow = true;
    return add(mesh);
  }
  function cyl(rt,rb,h,m,x,y,z) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,24), m);
    mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true;
    return add(mesh);
  }
  function sph(r,m,x,y,z) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r,24,24), m);
    mesh.position.set(x,y,z); mesh.castShadow = true; return add(mesh);
  }
  function plane(w,d,m,x,y,z,rx=0,ry=0) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,d), m);
    mesh.position.set(x,y,z); mesh.rotation.set(rx,ry,0);
    mesh.receiveShadow = true; return add(mesh);
  }
  function torus(r,tube,m,x,y,z,rx=0) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(r,tube,12,32), m);
    mesh.position.set(x,y,z); mesh.rotation.x = rx; mesh.castShadow = true;
    return add(mesh);
  }
  function clickable(mesh, data) { mesh.userData = { clickable: true, data }; clickables.push(mesh); return mesh; }

  // ── ROOM SHELL ────────────────────────────────────────
  plane(22,16,M.floorWood,0,0,0,-Math.PI/2);
  for(let i=-5;i<=5;i++){
    const s=new THREE.Mesh(new THREE.PlaneGeometry(22,.012),new THREE.MeshBasicMaterial({color:0x0d0907}));
    s.rotation.x=-Math.PI/2; s.position.set(i*1.1,.002,0); add(s);
  }
  plane(22,9,M.wallPaint,0,4.5,-8);
  plane(16,9,M.wallPaint,-11,4.5,0,0,Math.PI/2);
  plane(16,9,M.wallPaint,11,4.5,0,0,-Math.PI/2);
  plane(22,9,M.ceiling,0,9,0,Math.PI/2);
  box(22,.06,.06,M.baseboard,0,1.1,-7.94);
  box(22,.06,.06,M.baseboard,0,1.1,7.94);
  box(22,.12,.08,M.baseboard,0,.06,-7.94);
  plane(8,6,M.rugBorder,0,.005,1.5,-Math.PI/2);
  plane(7.4,5.4,M.rug,0,.006,1.5,-Math.PI/2);

  // ── DESK ZONE ─────────────────────────────────────────
  box(3.4,.1,1.5,M.deskWood,-4,1.05,2.4);
  box(3.4,.04,.04,M.deskWoodLight,-4,1.04,1.67);
  box(1.6,.1,1.8,M.deskWood,-5.4,1.05,-6.8);
  [[-5.6,1.68],[-2.4,1.68],[-5.6,3.1],[-2.4,3.1]].forEach(([x,z])=>{
    box(.08,1.05,.08,M.metalDark,x,.525,z);
    box(.12,.04,.12,M.metalDark,x,.02,z);
  });
  box(.8,.14,.14,M.metalDark,-4,.66,1.8);
  box(.7,.04,.35,M.metalMid,-3.5,1.12,-6.7);
  box(.06,.55,.06,M.metalDark,-3.5,1.37,-6.62);
  const monBack = box(2.4,.06,1.36,M.laptopBody,-3.5,1.68,-6.62);
  clickable(monBack, { ey:'Work Experience', title:'Teledyne FLIR — Controls Engineering', body:'Designed C++ flight path controllers reducing yaw/roll error by ~2°. Built 12+ MATLAB simulation scripts cutting crashes by 4/quarter, saving ~$60K.', chips:['C++','Python','MATLAB','Control Systems'] });
  const monFace = box(2.36,1.32,.04,M.laptopBody,-3.5,1.96,-6.5);
  clickable(monFace, monBack.userData.data);
  const screenContent = new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.18), M.screenOn);
  screenContent.position.set(-3.5,1.96,-6.47); add(screenContent);
  for(let i=0;i<8;i++){
    const ll=new THREE.Mesh(new THREE.PlaneGeometry(.3+Math.random()*.9,.022),
      new THREE.MeshBasicMaterial({color:i%3===0?0x69dd80:i%3===1?0x7ab4ff:0xffcc66,transparent:true,opacity:.7}));
    ll.position.set(-3.5+(Math.random()-.5)*.8,1.62+i*.092,-6.46); add(ll);
  }
  const lapBase = clickable(box(1.2,.055,.85,M.laptopBody,-4.2,1.11,2.5), { ey:'Work Experience', title:'SQI Diagnostics & Definity Financial', body:'Software & automation co-ops. At Definity: Android test automation, BrowserStack REST API (100% automation), Docker/JUNIT file upload scripts.', chips:['Python','REST API','Docker','BrowserStack','Android Testing'] });
  const lapScreen = box(1.2,.72,.04,M.laptopBody,-4.2,1.5,2.15);
  lapScreen.rotation.x=-.18; clickable(lapScreen, lapBase.userData.data);
  const lapGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.06,.6),
    new THREE.MeshBasicMaterial({color:0x1a2a44,transparent:true,opacity:.85}));
  lapGlow.position.set(-4.2,1.5,2.13); lapGlow.rotation.x=-.18; add(lapGlow);
  box(.95,.02,.32,M.metalMid,-4.2,1.09,2.8);
  for(let row=0;row<3;row++)for(let col=0;col<12;col++){
    const k=new THREE.Mesh(new THREE.BoxGeometry(.06,.015,.06),new THREE.MeshLambertMaterial({color:0x2a2a3c}));
    k.position.set(-4.72+col*.075,1.105,2.68+row*.09); add(k);
  }
  box(.1,.04,.16,M.metalMid,-3.4,1.08,2.7);
  cyl(.075,.065,.18,M.pot,-3,1.14,2.4);
  box(.38,.02,.28,new THREE.MeshLambertMaterial({color:0x1a1a28}),-3.7,1.1,3.1);
  box(.34,.022,.24,new THREE.MeshLambertMaterial({color:0xe8e0d0}),-3.7,1.11,3.1);
  box(.25,.03,.25,M.metalMid,-4.9,1.09,2.3);
  box(0.85,.1,.85,M.chairFabric,-4,0.78,3.7); box(.81,.06,.81,M.chairLeather,-4,0.82,3.7);
  box(.82,.7,.08,M.chairFabric,-4,1.25,4.1); box(.78,.66,.05,M.chairLeather,-4,1.27,4.12);
  box(.08,.05,.38,M.chairLeather,-3.55,.98,3.82); box(.08,.05,.38,M.chairLeather,-4.45,.98,3.82);
  box(.08,.38,.04,M.metalDark,-3.55,.66,3.9); box(.08,.38,.04,M.metalDark,-4.45,.66,3.9);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;box(.55,.04,.08,M.metalDark,-4+Math.cos(a)*.26,.08,3.7+Math.sin(a)*.26,a);}
  cyl(.04,.04,.7,M.chrome,-4,.42,3.7); cyl(.28,.28,.04,M.metalDark,-4,.04,3.7);

  // ── BOOKSHELF ZONE ────────────────────────────────────
  box(.06,4.6,.4,M.shelfWood,2.35,2.3,-6.3); box(.06,4.6,.4,M.shelfWood,4.65,2.3,-6.3);
  box(2.36,.06,.4,M.shelfWood,3.5,4.58,-6.3); box(2.36,.06,.4,M.shelfWood,3.5,.04,-6.3);
  [.72,1.52,2.32,3.12,3.9].forEach(h=>box(2.24,.06,.38,M.shelfWood,3.5,h,-6.3));
  box(2.24,4.52,.02,M.wallAccent,3.5,2.3,-6.5);
  const bookData = [
    { ey:'UW ASIC Design Team', title:'Control Group — Testbench Lead', body:'Building production cocotb testbenches: round-robin bus arbiter, AES FSM (10-state), SHA FSM (8-state), request queue, completion queue. Python verification for digital logic modules.', chips:['cocotb','Python','SystemVerilog','AES','SHA'] },
    { ey:'ECE327', title:'MVM Verilog Engine', body:'Pipelined matrix-vector multiplication engine. Modular datapath — dot product, accumulator, controller. ~3× throughput vs non-pipelined baseline. 100% testbench coverage.', chips:['SystemVerilog','RTL','Pipelining','ECE327'] },
  ];
  [[.72,.6,7,2.42,.28],[1.52,1.4,6,2.45,.3],[2.32,2.18,8,2.42,.26],[3.12,3.0,5,2.45,.32]].forEach(([h,dh,n,sx,sp])=>{
    for(let i=0;i<n;i++){
      const bh=.6+Math.random()*.25;
      const bk=box(.16+Math.random()*.06,bh,.3,M.books[i%M.books.length],sx+i*sp,dh+bh/2,-6.3);
      clickable(bk, bookData[i%2]);
    }
  });
  cyl(.1,.08,.14,M.pot,4.3,3.22,-6.3); sph(.12,M.plant,4.3,3.42,-6.3);

  // ── PINBOARD ──────────────────────────────────────────
  box(3.6,.08,2.4,M.shelfWood,0,4.6,-7.94);
  box(3.4,.02,2.2,M.corkboard,0,4.6,-7.9);
  const pinData = [
    { ey:'AI Agent', title:'AI Agent — Python LLM Tool', body:'General-purpose AI agent for search and query. LLM-backed reasoning with tool use for natural language querying, web search, and task automation.', chips:['Python','LLMs','Tool Use','Search','Agents'] },
    { ey:'Embedded', title:'Custom RTOS — STM32F401RE', body:'Lightweight RTOS from scratch. PendSV context switching in ARM Thumb assembly, cooperative scheduling, TCBs, dynamic memory. 8 concurrent tasks, 5% overhead.', chips:['C','ARM Assembly','STM32','PendSV'] },
    { ey:'Computer Vision', title:'Stratford Light Festival', body:'YOLOv8 real-time people tracking with live visual effects. Presented in Stratford Light Festival competition across two phases and 3 months of testing.', chips:['Python','YOLOv8','OpenCV','Raspberry Pi'] },
    { ey:'Hardware', title:'Single-Cycle RISC-V CPU', body:'Built in Verilog: ALU, control unit, register file, instruction/data memory, program counter. 20+ RISC-style instructions. Testbenches cut verification time 30%.', chips:['Verilog','RISC-V','ALU','RTL'] },
    { ey:'Baja SAE', title:'Data Acquisition System', body:'CAN/I2C DAQ — ESP32 with MPU6050 and A3144 hall effect sensor transmitting to SD card at 95% accuracy. Built for the Baja SAE competition car.', chips:['C++','ESP32','CAN','I2C','Linux'] },
  ];
  [[-.9,4.9],[ .3,4.2],[1.1,4.9],[-.2,4.2],[.9,4.5]].forEach(([px,py],i)=>{
    const c=clickable(box(.8,.02,.55,new THREE.MeshLambertMaterial({color:[0x1a2a3a,0x1a1a2a,0x1f1a10,0x1a2a1a,0x2a1a1a][i]}),px,py,-7.87), pinData[i]);
    sph(.03,M.pin,px+(Math.random()-.5)*.1,py+.35,-7.84);
  });

  // ── LAMP CORNER ───────────────────────────────────────
  cyl(.22,.22,.06,M.lampBase,-7.2,.03,-5.8); cyl(.12,.1,.06,M.lampBase,-7.2,.07,-5.8);
  cyl(.028,.028,3.6,M.chrome,-7.2,1.85,-5.8);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.38,.44,24,1,true), M.lampShade);
  shade.position.set(-7.2,3.9,-5.8); shade.rotation.x=Math.PI; shade.castShadow=true;
  clickable(shade, { ey:'About Me', title:'Harry Wang', body:'4A Computer Engineering at UWaterloo. Electrical & Embedded Lead on Baja SAE. Control group on ASIC team. 5 co-ops: SQI → Litens → Definity → Teledyne FLIR → Zynga.\n\ngithub.com/harryjwang · linkedin.com/in/harry-j-wang', chips:['UWaterloo','4A CompEng','Markham ON','5 Co-ops'] });
  add(shade); torus(.38,.02,M.lampBase,-7.2,3.68,-5.8,Math.PI/2);
  box(1.0,.22,1.0,M.couchFabric,-6.2,.66,-5.5); box(.92,.12,.92,new THREE.MeshLambertMaterial({color:0x38304e}),-6.2,.72,-5.5);
  box(1.0,.75,.14,M.couchFabric,-6.2,1.16,-6.0);
  box(.14,.45,.88,M.couchFabric,-6.67,.68,-5.5); box(.14,.45,.88,M.couchFabric,-5.73,.68,-5.5);
  [[-0.9,0.4],[0.9,0.4],[-0.9,-0.4],[0.9,-0.4]].forEach(([dx,dz])=>box(.08,.44,.08,M.shelfWood,-6.2+dx*.5,.22,-5.5+dz*.5));
  cyl(.28,.28,.04,M.deskWood,-5.2,.58,-4.8); cyl(.04,.04,.58,M.metalDark,-5.2,.29,-4.8);
  cyl(.065,.055,.12,new THREE.MeshLambertMaterial({color:0x3a2a1a}),-5.2,.64,-4.8);
  cyl(.22,.18,.42,M.potDark,-8.5,.21,-6.8); cyl(.24,.2,.04,M.potDark,-8.5,.43,-6.8);
  sph(.32,M.plant,-8.5,.82,-6.8); sph(.24,M.plantDark,-8.1,1.0,-6.5); sph(.2,M.plant,-8.8,.95,-7.0);

  // ── SPORTS CORNER ─────────────────────────────────────
  const vball = sph(.3,M.volleyball,7.0,.3,-5.5);
  clickable(vball, { ey:'Sports', title:'Volleyball', body:'Competitive volleyball — fast reflexes, team coordination, and spatial awareness. The same instincts that make a good setter make a good engineer.', chips:['Volleyball','Competitive','Team Sports'] });
  [0,1,2].forEach(i=>{
    const t=new THREE.Mesh(new THREE.TorusGeometry(.3,.012,8,32),M.vbLine);
    t.position.copy(vball.position); t.rotation.set(i*.9,i*.6,0);
    clickable(add(t), vball.userData.data);
  });
  const rg = new THREE.Group();
  const rHandle=new THREE.Mesh(new THREE.BoxGeometry(.08,.65,.05),M.racketHandle);
  rg.add(rHandle);
  const rHead=new THREE.Mesh(new THREE.TorusGeometry(.28,.038,8,32),M.racketFrame);
  rHead.position.set(0,.62,0); rg.add(rHead);
  const rThroat=new THREE.Mesh(new THREE.BoxGeometry(.08,.25,.04),M.racketFrame);
  rThroat.position.set(0,.38,0); rg.add(rThroat);
  for(let i=-4;i<=4;i++){
    const sh=new THREE.Mesh(new THREE.BoxGeometry(.5,.008,.008),M.racketString); sh.position.set(0,.62+i*.054,0); rg.add(sh);
    const sv=new THREE.Mesh(new THREE.BoxGeometry(.008,.5,.008),M.racketString); sv.position.set(i*.054,.62,0); rg.add(sv);
  }
  rg.position.set(8.5,2.1,-5.5); rg.rotation.set(0,-.3,.4);
  const racketData = { ey:'Sports', title:'Tennis', body:'Tennis sharpens individual focus, consistency, and adaptability. Every match is a debugging session — observe, adjust, iterate. Playing since high school.', chips:['Tennis','Individual Sport','Focus'] };
  rg.children.forEach(c=>{ c.castShadow=true; clickable(c, racketData); });
  scene.add(rg);
  box(.72,.42,.32,M.sportsBag,7.4,.21,-6.2); box(.68,.38,.28,new THREE.MeshLambertMaterial({color:0x263298}),7.4,.21,-6.2);
  cyl(.055,.055,.26,new THREE.MeshLambertMaterial({color:0x1a4a6a}),6.7,.13,-4.8);

  // ── ROOM DETAILS ──────────────────────────────────────
  cyl(.18,.18,.04,M.metalMid,0,8.96,0); cyl(.08,.08,.25,M.chrome,0,8.82,0);
  cyl(.32,.28,.14,new THREE.MeshLambertMaterial({color:0xd8d0b8}),0,8.62,0);
  const bulbGlow=new THREE.Mesh(new THREE.CircleGeometry(.1,16),new THREE.MeshBasicMaterial({color:0xffefc0,transparent:true,opacity:.9}));
  bulbGlow.position.set(0,8.55,0); bulbGlow.rotation.x=Math.PI/2; add(bulbGlow);
  box(4,.06,.55,M.deskWood,0,1.0,-7.5); box(.06,.96,.55,M.deskWood,-1.96,.52,-7.5); box(.06,.96,.55,M.deskWood,1.96,.52,-7.5);
  sph(.09,new THREE.MeshLambertMaterial({color:0x8a8a9a}),.9,1.1,-7.38);

  // ── CAMERA CONTROLS ───────────────────────────────────
  let camTarget = { x:0, y:3.2, z:11 };
  let lookTarget = { x:0, y:1.5, z:0 };
  let lookCurrent = { x:0, y:1.5, z:0 };
  let theta=0, phi=0, thetaDrag=0, phiDrag=0;
  let isDragging=false, dragStart={x:0,y:0}, hasMoved=false;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  function checkHover(x, y) {
    mouse.set((x/window.innerWidth)*2-1, -(y/window.innerHeight)*2+1);
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(clickables);
    hovered = hits.length > 0 ? hits[0].object : null;
    return !!hovered;
  }

  const lerp = (a,b,t) => a+(b-a)*t;
  const lerpV = (a,b,t) => ({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),z:lerp(a.z,b.z,t)});

  // ── ANIMATE ───────────────────────────────────────────
  const clock = new THREE.Clock();
  const camPos = new THREE.Vector3();
  const lookV = new THREE.Vector3();
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    vball.position.y = .3 + Math.sin(t*1.1)*.07;
    lampLight.intensity = 1.3 + Math.sin(t*1.9)*.12;
    bulbGlow.material.opacity = .85 + Math.sin(t*.8)*.08;
    lapGlow.material.opacity = .8 + Math.sin(t*.4)*.1;
    monGlow.intensity = .5 + Math.sin(t*.3)*.15;
    rg.rotation.z = .4 + Math.sin(t*.5)*.03;
    screenContent.material.color.setHSL(.6, .6, .25 + Math.sin(t*.5)*.05);

    const ox = Math.sin(theta)*1.3, oz = Math.cos(theta)*1.3, oy = Math.sin(phi)*1.3;
    camPos.set(lerp(camera.position.x,camTarget.x+ox,.055),lerp(camera.position.y,camTarget.y+oy,.055),lerp(camera.position.z,camTarget.z+oz,.055));
    camera.position.copy(camPos);
    lookCurrent = lerpV(lookCurrent, lookTarget, .065);
    lookV.set(lookCurrent.x+ox*.2, lookCurrent.y, lookCurrent.z);
    camera.lookAt(lookV);

    if (hovered) { const s=1+Math.sin(t*5)*.02; hovered.scale.setScalar(s); }
    renderer.render(scene, camera);
  }
  animate();

  // ── PUBLIC API ────────────────────────────────────────
  function goZone(i, zones) {
    const z = zones[i];
    camTarget = {...z.cam};
    lookTarget = { x: z.cam.x*.25, y: 1.5, z: z.cam.z*.1 };
    theta = 0; phi = 0;
    zoneLights.forEach((l,j) => { l.intensity = j===i ? 1.6 : 0; });
  }

  function onMouseMove(e) {
    const isHov = checkHover(e.clientX, e.clientY);
    if (onZoneChange) onZoneChange('hover', isHov);
    if (isDragging) {
      const dx=e.clientX-dragStart.x, dy=e.clientY-dragStart.y;
      if (Math.abs(dx)+Math.abs(dy)>3) hasMoved=true;
      theta = thetaDrag - dx*.005;
      phi = Math.max(-.35, Math.min(.5, phiDrag + dy*.004));
    }
  }
  function onMouseDown(e) { isDragging=true; hasMoved=false; dragStart={x:e.clientX,y:e.clientY}; thetaDrag=theta; phiDrag=phi; }
  function onMouseUp() { isDragging=false; if (!hasMoved && hovered?.userData?.data) onClickObject(hovered.userData.data); }
  function onTouchStart(e) { const t=e.touches[0]; isDragging=true; hasMoved=false; dragStart={x:t.clientX,y:t.clientY}; thetaDrag=theta; phiDrag=phi; }
  function onTouchMove(e) { const t=e.touches[0]; const dx=t.clientX-dragStart.x,dy=t.clientY-dragStart.y; if(Math.abs(dx)+Math.abs(dy)>5)hasMoved=true; theta=thetaDrag-dx*.005; phi=Math.max(-.35,Math.min(.5,phiDrag+dy*.004)); }
  function onResize() { camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchstart', onTouchStart, {passive:true});
  window.addEventListener('touchmove', onTouchMove, {passive:true});
  window.addEventListener('touchend', ()=>{isDragging=false;});
  window.addEventListener('resize', onResize);

  return {
    goZone,
    destroy() {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    },
    getCursorHovered: () => !!hovered,
  };
}
