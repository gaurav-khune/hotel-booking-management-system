document.addEventListener('DOMContentLoaded', () => {
  console.log('3D Room page loaded');
  
  if (typeof THREE === 'undefined') {
    console.error('THREE.js not loaded');
    return;
  }
  
  const canvas = document.getElementById('scene');
  const roomTitle = document.getElementById('room-title');
  const roomDescription = document.getElementById('room-description');

  const roomNames = new Set([
    'Deluxe Room',
    'Junior Suite',
    'Grand Suite',
    'Presidential Suite'
  ]);

  const params = new URLSearchParams(window.location.search);
  const selectedRoom = roomNames.has(params.get('room')) ? params.get('room') : 'Deluxe Room';

  roomTitle.textContent = selectedRoom;
  roomDescription.textContent = 'Move through the bedroom and step onto the balcony with the arrow keys.';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  scene.fog = new THREE.Fog(0x1a1a1a, 35, 60);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 150);
  camera.position.set(1.5, 1.65, 7.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = true;

  const ambient = new THREE.AmbientLight(0x222222, 0.45);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0x2b2b2b, 0.6);
  sun.position.set(-5, 12, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  scene.add(sun);

  const warmLamp = new THREE.PointLight(0x7a4f36, 1.0, 18);
  warmLamp.position.set(-3, 2.3, -0.5);
  scene.add(warmLamp);

  const bedLight = new THREE.PointLight(0x5f4b3a, 0.9, 14);
  bedLight.position.set(-2.5, 2.4, 2);
  scene.add(bedLight);

  const balconyLight = new THREE.PointLight(0x4f6b7a, 0.9, 18);
  balconyLight.position.set(0, 2.8, -9);
  scene.add(balconyLight);

  const accentLight = new THREE.PointLight(0x6b4f4f, 0.6, 12);
  accentLight.position.set(3, 2.2, 1);
  scene.add(accentLight);

  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.6, metalness: 0.05 });
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.95, metalness: 0 });
  const accentWallMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a4a, roughness: 0.85, metalness: 0.05 });
  const furnitureWood = new THREE.MeshStandardMaterial({ color: 0x3d2315, roughness: 0.6, metalness: 0.1 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.65, metalness: 0.08 });
  const fabricMaterial = new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.88, metalness: 0 });
  const beddingMaterial = new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.8, metalness: 0 });
  const luxuryGold = new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.35, metalness: 0.85 });
  const metallicMaterial = new THREE.MeshStandardMaterial({ color: 0x6b6b6b, roughness: 0.5, metalness: 0.6 });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.7 });
  const marbleFloor = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.4, metalness: 0.08 });

  const roomGroup = new THREE.Group();
  scene.add(roomGroup);

  function makeWall(width, height, depth, x, y, z, material) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    wall.position.set(x, y, z);
    wall.receiveShadow = true;
    wall.castShadow = true;
    roomGroup.add(wall);
    return wall;
  }

  const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.5, metalness: 0.12 }));
  floor.position.set(0, -0.15, 0);
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // Floor pattern tiles with decorative accents - dark luxury
  for (let x = -5; x <= 5; x += 2.5) {
    for (let z = -7; z <= 7; z += 2.5) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.02, 2.3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.45 }));
      tile.position.set(x, 0.05, z);
      roomGroup.add(tile);
      if ((Math.abs(x) + Math.abs(z)) % 5 === 0) {
        const corner = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.3), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.8 }));
        corner.position.set(x + 1, 0.08, z + 1);
        roomGroup.add(corner);
      }
    }
  }
  const floorStrip1 = new THREE.Mesh(new THREE.BoxGeometry(12, 0.015, 0.15), new THREE.MeshStandardMaterial({ color: 0x8b7d5e, roughness: 0.4 }));
  floorStrip1.position.set(0, 0.1, 3);
  roomGroup.add(floorStrip1);
  const floorStrip2 = new THREE.Mesh(new THREE.BoxGeometry(12, 0.015, 0.15), new THREE.MeshStandardMaterial({ color: 0x8b7d5e, roughness: 0.4 }));
  floorStrip2.position.set(0, 0.1, -3);
  roomGroup.add(floorStrip2);

  // Floor border trim - enhanced
  const floorTrimFront = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.85 }));
  floorTrimFront.position.set(0, 0.05, 7.8);
  roomGroup.add(floorTrimFront);

  const floorTrimBack = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.85 }));
  floorTrimBack.position.set(0, 0.05, -7.8);
  roomGroup.add(floorTrimBack);

  // Side trim
  const floorTrimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.85 }));
  floorTrimLeft.position.set(-5.8, 0.05, 0);
  roomGroup.add(floorTrimLeft);

  const floorTrimRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.85 }));
  floorTrimRight.position.set(5.8, 0.05, 0);
  roomGroup.add(floorTrimRight);

  // Grand area rug with pattern
  const rugGeometry = new THREE.CircleGeometry(2.8, 64);
  const rugMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.88, metalness: 0.02 });
  const rug = new THREE.Mesh(rugGeometry, rugMaterial);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-1.2, 0.08, 0.5);
  rug.receiveShadow = true;
  roomGroup.add(rug);

  // Rug border detail - enhanced gold
  const rugBorder = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.2, 8, 64), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.22, metalness: 0.9 }));
  rugBorder.rotation.x = -Math.PI / 2;
  rugBorder.position.set(-1.2, 0.12, 0.5);
  roomGroup.add(rugBorder);

  // Rug inner circle pattern
  const rugInner = new THREE.Mesh(new THREE.CircleGeometry(2.3, 64), new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 0.92 }));
  rugInner.rotation.x = -Math.PI / 2;
  rugInner.position.set(-1.2, 0.1, 0.5);
  roomGroup.add(rugInner);

  makeWall(12, 4, 0.2, 0, 2, 8, new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.95 }));
  makeWall(12, 4, 0.2, 0, 2, -6.8, new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.97 }));
  makeWall(0.2, 4, 16, -6, 2, 1, new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.95 }));
  makeWall(0.2, 4, 16, 6, 2, 1, new THREE.MeshStandardMaterial({ color: 0x3d3520, roughness: 0.9 }));
  const wallStripTop = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.2), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.8 }));
  wallStripTop.position.set(0, 3.7, 8.05);
  roomGroup.add(wallStripTop);
  const wallStripMid = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.2), new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 0.35, metalness: 0.6 }));
  wallStripMid.position.set(0, 2, 8.05);
  roomGroup.add(wallStripMid);

  const wallPanelLeft = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x2d5a4a, roughness: 0.92 }));
  wallPanelLeft.position.set(-5.2, 2, 6.05);
  roomGroup.add(wallPanelLeft);
  const panelFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.35, 0.1), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.8 }));
  panelFrameLeft.position.set(-5.2, 2, 6.15);
  roomGroup.add(panelFrameLeft);
  const wallPanelRight = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.8, 0.08), new THREE.MeshStandardMaterial({ color: 0x4a5a6a, roughness: 0.93 }));
  wallPanelRight.position.set(5.2, 2, -5.05);
  roomGroup.add(wallPanelRight);
  const panelFrameRight = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.95, 0.1), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.8 }));
  panelFrameRight.position.set(5.2, 2, -4.95);
  roomGroup.add(panelFrameRight);
  const wallPanelMid = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x5a4a3d, roughness: 0.94 }));
  wallPanelMid.position.set(-0.5, 2.2, 8.05);
  roomGroup.add(wallPanelMid);
  const wallPanelMidFrame = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.35, 0.1), new THREE.MeshStandardMaterial({ color: 0xb38a2a, roughness: 0.28, metalness: 0.8 }));
  wallPanelMidFrame.position.set(-0.5, 2.2, 8.15);
  roomGroup.add(wallPanelMidFrame);

  const balconyFloor = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.25, 5.5), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85, metalness: 0.08 }));
  balconyFloor.position.set(0, -0.05, -8.5);
  balconyFloor.receiveShadow = true;
  roomGroup.add(balconyFloor);

  const balconyBack = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.3, 0.25), wallMaterial);
  balconyBack.position.set(0, 2.4, -11);
  roomGroup.add(balconyBack);

  const balconySideLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.4, 5.5), wallMaterial);
  balconySideLeft.position.set(-3.75, 1.15, -8.5);
  roomGroup.add(balconySideLeft);

  const balconySideRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.4, 5.5), wallMaterial);
  balconySideRight.position.set(3.75, 1.15, -8.5);
  roomGroup.add(balconySideRight);

  const balconyRailing = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.18, 0.12), metallicMaterial);
  balconyRailing.position.set(0, 1.2, -10.65);
  balconyRailing.castShadow = true;
  roomGroup.add(balconyRailing);

  // Railing posts
  for (let offset = -3.5; offset <= 3.5; offset += 0.9) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.15), metallicMaterial);
    post.position.set(offset, 0.65, -10.65);
    post.castShadow = true;
    roomGroup.add(post);
  }

  // Glass panels on balcony
  const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(7.3, 1.3, 0.08), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, opacity: 0.3, transparent: true, roughness: 0.05, metalness: 0.7 }));
  glassPanel.position.set(0, 1.35, -10.58);
  roomGroup.add(glassPanel);

  // Balcony corner seats
  const cornerSeat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.8), new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.8 }));
  cornerSeat.position.set(3, 0.3, -9.5);
  cornerSeat.castShadow = true;
  roomGroup.add(cornerSeat);

  const bedBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.55, 2.1), new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.6, metalness: 0.05 }));
  bedBase.position.set(-2.3, 0.35, 2.2);
  bedBase.castShadow = true;
  bedBase.receiveShadow = true;
  roomGroup.add(bedBase);

  // Bed skirt - luxurious
  const bedSkirt = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.4, 2.3), new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.85 }));
  bedSkirt.position.set(-2.3, 0.15, 2.2);
  roomGroup.add(bedSkirt);

  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.45, 2), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8 }));
  mattress.position.set(-2.3, 0.82, 2.2);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  roomGroup.add(mattress);

  // Luxury duvet - cream with subtle sheen
  const duvet = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 1.95), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7, metalness: 0.1 }));
  duvet.position.set(-2.3, 1.15, 2.2);
  duvet.castShadow = true;
  roomGroup.add(duvet);
  const duvetPattern = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.18, 1.9), new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.75, metalness: 0.08 }));
  duvetPattern.position.set(-2.3, 1.25, 2.2);
  roomGroup.add(duvetPattern);
  const bedRunner = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 0.5), new THREE.MeshStandardMaterial({ color: 0x8b3a62, roughness: 0.75 }));
  bedRunner.position.set(-2.3, 1.35, 1.2);
  roomGroup.add(bedRunner);
  const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.55), new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.75 }));
  pillow1.position.set(-3.4, 1.2, 1.4);
  pillow1.castShadow = true;
  roomGroup.add(pillow1);
  const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.55), new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.8 }));
  pillow2.position.set(-2.3, 1.22, 1.4);
  pillow2.castShadow = true;
  roomGroup.add(pillow2);
  const pillow3 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.55), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.77 }));
  pillow3.position.set(-1.2, 1.21, 1.4);
  pillow3.castShadow = true;
  roomGroup.add(pillow3);

  // Decorative throw pillows - vibrant
  const throwPillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.28, 0.6), new THREE.MeshStandardMaterial({ color: 0x8b3a62, roughness: 0.8 }));
  throwPillow1.position.set(-3.5, 1.3, 2.5);
  throwPillow1.rotation.z = 0.2;
  roomGroup.add(throwPillow1);

  const throwPillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.28, 0.6), new THREE.MeshStandardMaterial({ color: 0x3d6b4a, roughness: 0.8 }));
  throwPillow2.position.set(-1.1, 1.3, 2.5);
  throwPillow2.rotation.z = -0.2;
  roomGroup.add(throwPillow2);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.5, 0.25), new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.55 }));
  headboard.position.set(-2.3, 1.5, 3.35);
  headboard.castShadow = true;
  roomGroup.add(headboard);
  const upholstery = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.3, 0.15), new THREE.MeshStandardMaterial({ color: 0x4a3a2d, roughness: 0.8 }));
  upholstery.position.set(-2.3, 1.5, 3.42);
  roomGroup.add(upholstery);
  const headboardAccent = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 }));
  headboardAccent.position.set(-2.3, 1.5, 3.45);
  roomGroup.add(headboardAccent);
  const studMaterial = new THREE.MeshStandardMaterial({ color: 0x8b6b3a, roughness: 0.35, metalness: 0.7 });
  for (let x = -1.3; x <= 1.3; x += 0.7) {
    for (let y = 0.8; y <= 2; y += 0.4) {
      const stud = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), studMaterial);
      stud.position.set(x - 2.3, y, 3.5);
      roomGroup.add(stud);
    }
  }

  const shelf1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.3), new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.65 }));
  shelf1.position.set(-3, 2.2, 6.8);
  shelf1.castShadow = true;
  roomGroup.add(shelf1);
  const vase1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0x8b3a62, roughness: 0.6, metalness: 0.2 }));
  vase1.position.set(-3.3, 2.35, 6.8);
  roomGroup.add(vase1);
  const vase2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0x4ecdc4, roughness: 0.5, metalness: 0.3 }));
  vase2.position.set(-2.7, 2.38, 6.8);
  roomGroup.add(vase2);
  const artwork = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x2d3b52, roughness: 0.7 }));
  artwork.position.set(-2.3, 2.5, 3.5);
  roomGroup.add(artwork);

  const artframeGold = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.35, 0.12), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.88 }));
  artframeGold.position.set(-2.3, 2.5, 3.55);
  roomGroup.add(artframeGold);

  // Additional colorful artwork with premium frame
  const artwork2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 0.08), new THREE.MeshStandardMaterial({ color: 0x4a5a7a, roughness: 0.7 }));
  artwork2.position.set(4.8, 2.3, 1);

  // Modern art piece
  const modernArt = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.04), new THREE.MeshStandardMaterial({ color: 0x8b3a62, roughness: 0.8 }));
  modernArt.position.set(-5.8, 3, 0);
  roomGroup.add(modernArt);

  const modernArtFrame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.15, 0.08), new THREE.MeshStandardMaterial({ color: 0x7a5d4a, roughness: 0.6, metalness: 0.6 }));
  modernArtFrame.position.set(-5.8, 3, -0.05);
  roomGroup.add(modernArtFrame);



  const nightstandGeometry = new THREE.BoxGeometry(0.7, 0.65, 0.65);
  [-4.2, -0.4].forEach((x) => {
    // Nightstand with dark wood
    const stand = new THREE.Mesh(nightstandGeometry, new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.6 }));
    stand.position.set(x, 0.38, 3.05);
    stand.castShadow = true;
    stand.receiveShadow = true;
    roomGroup.add(stand);

    // Gold accent on nightstand
    const standAccent = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.7), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9 }));
    standAccent.position.set(x, 0.68, 3.05);
    roomGroup.add(standAccent);

    // Drawer fronts - with color
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.05), new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.7 }));
    drawer.position.set(x, 0.25, 3.38);
    roomGroup.add(drawer);

    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.7 }));
    lampStem.position.set(x, 1.05, 3.05);
    lampStem.castShadow = true;
    roomGroup.add(lampStem);

const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.8 }));
    lampShade.position.set(x, 1.28, 3.05);
    lampShade.castShadow = true;
    roomGroup.add(lampShade);

    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0x5a3a10, emissive: 0x3a1a00, emissiveIntensity: 0.12 }));
    lampBulb.position.set(x, 1.18, 3.05);
    roomGroup.add(lampBulb);
  });

  // Premium sofa base
  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 1.2), new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.65 }));
  sofaBase.position.set(2.5, 0.25, 0.5);
  sofaBase.castShadow = true;
  sofaBase.receiveShadow = true;
  roomGroup.add(sofaBase);

  const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.25, 1.1), new THREE.MeshStandardMaterial({ color: 0x4a3a2d, roughness: 0.8 }));
  sofaSeat.position.set(2.5, 0.7, 0.5);
  sofaSeat.castShadow = true;
  roomGroup.add(sofaSeat);

  // Sofa arms - elegant wood
  [-1.55, 1.55].forEach((x) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 1.15), new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.65 }));
    arm.position.set(x + 2.5, 0.58, 0.5);
    arm.castShadow = true;
    roomGroup.add(arm);

    const armGold = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.85 }));
    armGold.position.set(x + 2.5, 1.1, 0.5);
    roomGroup.add(armGold);
  });

  // Sofa back cushion - premium dark
  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.55, 0.25), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 }));
  sofaBack.position.set(2.5, 1.05, 1.4);
  sofaBack.castShadow = true;
  roomGroup.add(sofaBack);

  // Decorative cushions - vibrant colors
  const cushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.88 }));
  cushion1.position.set(1.5, 0.95, 0.3);
  cushion1.rotation.z = 0.3;
  roomGroup.add(cushion1);

  const cushion2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), new THREE.MeshStandardMaterial({ color: 0x00d4ff, roughness: 0.88 }));
  cushion2.position.set(3.5, 0.95, 0.3);
  cushion2.rotation.z = -0.3;
  roomGroup.add(cushion2);

  // Additional colorful cushions - vibrant
  const cushion3 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.45), new THREE.MeshStandardMaterial({ color: 0xffa502, roughness: 0.85 }));
  cushion3.position.set(2.2, 1.2, 0.8);
  cushion3.rotation.z = 0.15;
  roomGroup.add(cushion3);

  const cushion4 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.45), new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.85 }));
  cushion4.position.set(2.8, 1.2, -0.1);
  cushion4.rotation.z = -0.15;
  roomGroup.add(cushion4);

  // Premium coffee table with glass top
  const coffeeTableBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1), new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.7 }));
  coffeeTableBase.position.set(2.5, 1.1, 0.5);
  coffeeTableBase.castShadow = true;
  coffeeTableBase.receiveShadow = true;
  roomGroup.add(coffeeTableBase);

  // Table legs - elegant
  [[0.7, 0.45], [-0.7, 0.45], [0.7, -0.45], [-0.7, -0.45]].forEach(pos => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.75 }));
    leg.position.set(pos[0] + 2.5, 0.75, pos[1] + 0.5);
    roomGroup.add(leg);
  });

  // Luxury glass top
  const glassTop = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.025, 1.05), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, opacity: 0.4, transparent: true, roughness: 0.05, metalness: 0.7 }));
  glassTop.position.set(2.5, 1.22, 0.5);
  glassTop.receiveShadow = true;
  roomGroup.add(glassTop);

  // Decorative books on table - stacked
  const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.28), new THREE.MeshStandardMaterial({ color: 0xc44569, roughness: 0.75 }));
  book1.position.set(2, 1.25, 0.2);
  book1.rotation.z = 0.25;
  book1.castShadow = true;
  roomGroup.add(book1);

  const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.25), new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.75 }));
  book2.position.set(2.8, 1.27, 0.5);
  book2.rotation.z = -0.15;
  book2.castShadow = true;
  roomGroup.add(book2);

  const book3 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.11, 0.26), new THREE.MeshStandardMaterial({ color: 0x2d5a4a, roughness: 0.75 }));
  book3.position.set(3, 1.28, 0.3);
  book3.rotation.z = 0.1;
  book3.castShadow = true;
  roomGroup.add(book3);

  // Decorative candle with golden holder
  const candleHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.025, 16), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9 }));
  candleHolder.position.set(2.5, 1.27, -0.2);
  roomGroup.add(candleHolder);

  const candleWax = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.85 }));
  candleWax.position.set(2.5, 1.35, -0.2);
  roomGroup.add(candleWax);

  const candleFlame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28, 16), new THREE.MeshStandardMaterial({ color: 0xff6b00, emissive: 0xff4500, emissiveIntensity: 0.25 }));
  candleFlame.position.set(2.5, 1.62, -0.2);
  roomGroup.add(candleFlame);

  // Add colorful paintings to walls
  const painting1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.03), new THREE.MeshStandardMaterial({ color: 0x2a5caa, roughness: 0.7 }));
  painting1.position.set(4.5, 2, 2);
  roomGroup.add(painting1);

  const painting1Frame = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.95, 0.08), luxuryGold);
  painting1Frame.position.set(4.5, 2, 1.95);
  roomGroup.add(painting1Frame);

  // Decorative lamp on side table
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.8 }));
  lampBase.position.set(3.5, 0.5, 3);
  roomGroup.add(lampBase);

  const lampBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.7 }));
  lampBody.position.set(3.5, 0.8, 3);
  roomGroup.add(lampBody);

  const lampShade2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.8 }));
  lampShade2.position.set(3.5, 1.3, 3);
  roomGroup.add(lampShade2);

  // Colorful flowers/plant in vase
  const flowerVase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.25, 16), new THREE.MeshStandardMaterial({ color: 0xc44569, roughness: 0.7 }));
  flowerVase.position.set(4, 0.5, 0.5);
  roomGroup.add(flowerVase);

  const flower1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xff1493, emissive: 0xff1493, emissiveIntensity: 0.2 }));
  flower1.position.set(4.1, 1.1, 0.4);
  roomGroup.add(flower1);

  const flower2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshStandardMaterial({ color: 0xff69b4, emissive: 0xff69b4, emissiveIntensity: 0.2 }));
  flower2.position.set(3.85, 1.15, 0.6);
  roomGroup.add(flower2);

  const flower3 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfd6464, emissive: 0xfd6464, emissiveIntensity: 0.2 }));
  flower3.position.set(4, 1.2, 0.8);
  roomGroup.add(flower3);

  // Colorful throw blanket on sofa
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.8), new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.85 }));
  blanket.position.set(2.5, 1.05, -0.3);
  blanket.rotation.z = 0.1;
  roomGroup.add(blanket);

  // Additional decorative elements
  const decorativeBowl = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x4ecdc4, roughness: 0.5, metalness: 0.3 }));
  decorativeBowl.scale.y = 0.5;
  decorativeBowl.position.set(2.5, 1.35, 0.3);
  roomGroup.add(decorativeBowl);

  // Decorative spheres on shelf
  const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.6, metalness: 0.2 }));
  sphere1.position.set(-0.5, 2, 3.8);
  roomGroup.add(sphere1);

  const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffd93d, roughness: 0.6, metalness: 0.2 }));
  sphere2.position.set(0, 2, 3.8);
  roomGroup.add(sphere2);

  const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0x6bcf7f, roughness: 0.6, metalness: 0.2 }));
  sphere3.position.set(0.5, 2, 3.8);
  roomGroup.add(sphere3);

  const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.4, 0.15), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 }));
  windowFrame.position.set(0, 1.3, -5.95);
  windowFrame.castShadow = true;
  roomGroup.add(windowFrame);

  // Premium window frame borders - gold
  const windowBorderTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.88 }));
  windowBorderTop.position.set(0, 2.6, -5.85);
  roomGroup.add(windowBorderTop);

  const windowBorderBottom = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.88 }));
  windowBorderBottom.position.set(0, 0, -5.85);
  roomGroup.add(windowBorderBottom);

  const windowBorderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.5, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.88 }));
  windowBorderLeft.position.set(-1.8, 1.3, -5.85);
  roomGroup.add(windowBorderLeft);

  const windowBorderRight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.5, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.88 }));
  windowBorderRight.position.set(1.8, 1.3, -5.85);
  roomGroup.add(windowBorderRight);

  const glassLeft = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.04), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, opacity: 0.3, transparent: true, roughness: 0.05, metalness: 0.7 }));
  glassLeft.position.set(-0.95, 1.25, -5.82);
  roomGroup.add(glassLeft);

  const glassRight = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.04), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, opacity: 0.3, transparent: true, roughness: 0.05, metalness: 0.7 }));
  glassRight.position.set(0.95, 1.25, -5.82);
  roomGroup.add(glassRight);

  // Window curtains
  const curtainLeft = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.3, 0.1), new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 }));
  curtainLeft.position.set(-1.8, 1.3, -5.7);
  roomGroup.add(curtainLeft);

  const curtainRight = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.3, 0.1), new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 }));
  curtainRight.position.set(1.8, 1.3, -5.7);
  roomGroup.add(curtainRight);

  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.5, 0.15), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 }));
  doorFrame.position.set(3.9, 1.3, -5.95);
  doorFrame.castShadow = true;
  roomGroup.add(doorFrame);

  // Door frame accent borders - gold
  const doorBorderTop = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.12, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.88 }));
  doorBorderTop.position.set(3.9, 2.6, -5.85);
  roomGroup.add(doorBorderTop);

  const doorBorderBottom = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.12, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.88 }));
  doorBorderBottom.position.set(3.9, 0, -5.85);
  roomGroup.add(doorBorderBottom);

  const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.2, 0.04), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, opacity: 0.35, transparent: true, roughness: 0.06, metalness: 0.65 }));
  doorGlass.position.set(3.9, 1.2, -5.82);
  roomGroup.add(doorGlass);

  // Premium door handle - luxury gold
  const handleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.15, metalness: 0.95 }));
  handleBase.rotation.z = Math.PI / 2;
  handleBase.position.set(4.85, 1.2, -5.75);
  roomGroup.add(handleBase);

  const handleKnob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshStandardMaterial({ color: 0xb8956a, roughness: 0.4, metalness: 0.8 }));
  handleKnob.position.set(4.95, 1.2, -5.75);
  roomGroup.add(handleKnob);

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 }));
  ceiling.position.set(0, 4.05, 0);
  ceiling.receiveShadow = true;
  roomGroup.add(ceiling);

  // Ceiling lights with color
  for (let x = -4; x <= 4; x += 4) {
    for (let z = -4; z <= 4; z += 4) {
      const lightFixture = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.4, metalness: 0.8 }));
      lightFixture.position.set(x, 3.92, z);
      roomGroup.add(lightFixture);

      const lightGlow = new THREE.PointLight(0xd4b896, 0.9, 15);
      lightGlow.position.set(x, 3.8, z);
      scene.add(lightGlow);
    }
  }

  const ceilingGlow = new THREE.PointLight(0xd4b896, 1.8, 25);
  ceilingGlow.position.set(0, 3.8, 1.2);
  scene.add(ceilingGlow);

  // Colorful accent lights
  const accentRed = new THREE.PointLight(0xff6b6b, 0.6, 12);
  accentRed.position.set(-2, 1.5, 4);
  scene.add(accentRed);

  const accentTeal = new THREE.PointLight(0x4ecdc4, 0.5, 10);
  accentTeal.position.set(4, 1.8, 2);
  scene.add(accentTeal);

  // Wall decorations
  const wallMirror = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.08), new THREE.MeshStandardMaterial({ color: 0x9bc4c4, metalness: 0.95, roughness: 0.1 }));
  wallMirror.position.set(-5.9, 1.8, 1);
  roomGroup.add(wallMirror);

  // Mirror frame - darker gold
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.65, 0.12), new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.4, metalness: 0.85 }));
  mirrorFrame.position.set(-5.9, 1.8, 0.95);
  roomGroup.add(mirrorFrame);

  // Wall accent stripe
  const accentStripe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3, 16), new THREE.MeshStandardMaterial({ color: 0x3d7a5a, roughness: 0.95 }));
  accentStripe.position.set(5.7, 2, 0);
  roomGroup.add(accentStripe);

  const controls = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    reset: false
  };

  const velocity = {
    move: 0,
    turn: 0
  };

  const startState = {
    position: camera.position.clone(),
    rotationY: camera.rotation.y
  };

  function onKeyChange(event, isDown) {
    if (event.code === 'ArrowUp') controls.forward = isDown;
    if (event.code === 'ArrowDown') controls.backward = isDown;
    if (event.code === 'ArrowLeft') controls.left = isDown;
    if (event.code === 'ArrowRight') controls.right = isDown;
    if (event.code === 'Space' && isDown) controls.reset = true;
  }

  window.addEventListener('keydown', (event) => onKeyChange(event, true));
  window.addEventListener('keyup', (event) => onKeyChange(event, false));

  function clampCamera() {
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -5.1, 5.1);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -10.2, 6.2);
    camera.position.y = 1.65;
  }

  function animate() {
    requestAnimationFrame(animate);

    const targetMove = controls.forward ? 0.06 : controls.backward ? -0.05 : 0;
    const targetTurn = controls.left ? 0.03 : controls.right ? -0.03 : 0;

    velocity.move += (targetMove - velocity.move) * 0.12;
    velocity.turn += (targetTurn - velocity.turn) * 0.14;

    camera.rotation.y += velocity.turn;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    camera.position.addScaledVector(direction, velocity.move);

    if (controls.reset) {
      camera.position.copy(startState.position);
      camera.rotation.set(0, startState.rotationY, 0);
      velocity.move = 0;
      velocity.turn = 0;
      controls.reset = false;
    }

    clampCamera();
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });
});