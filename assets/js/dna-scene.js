/**
 * dna-scene.js — "Медиа ДНК" (Раздел 3).
 * Three.js: светящееся ядро + двойная спираль с кликабельными узлами-категориями.
 * Если WebGL недоступен — секция показывает статичную сетку карточек (main.js: renderDnaFallback).
 */
(function () {
  "use strict";

  function supportsWebGL() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  const wrap = document.getElementById("dna-canvas-wrap");
  const fallback = document.getElementById("dna-fallback-grid");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!wrap) return;

  if (!supportsWebGL()) {
    wrap.classList.add("hidden");
    fallback?.classList.remove("hidden");
    return;
  }

  init().catch(() => {
    wrap.classList.add("hidden");
    fallback?.classList.remove("hidden");
  });

  async function init() {
    const THREE = await import("three");
    const { OrbitControls } = await import("./vendor/three/OrbitControls.js");

    const DATA = window.SITE_DATA.dnaNodes;

    let width = wrap.clientWidth;
    let height = wrap.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    wrap.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.minDistance = 6;
    controls.maxDistance = 16;
    controls.enablePan = false;
    controls.autoRotate = false;

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0x8fa6c4, 0.5));
    const goldLight = new THREE.PointLight(0xc5a26f, 3, 20);
    goldLight.position.set(0, 0, 4);
    scene.add(goldLight);

    // --- Universe group (rotates as a whole) ---
    const universe = new THREE.Group();
    scene.add(universe);

    // --- Core ("avatar") ---
    const coreGroup = new THREE.Group();
    universe.add(coreGroup);

    const coreGeo = new THREE.IcosahedronGeometry(1.1, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc5a26f,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(core);

    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xe8dcc4, transparent: true, opacity: 0.18 })
    );
    coreGroup.add(innerGlow);

    // --- Double helix ---
    const helixGroup = new THREE.Group();
    universe.add(helixGroup);

    const RADIUS = 2.6;
    const HEIGHT = 6.5;
    const TURNS = 3.2;
    const SEGMENTS = 220;

    function helixPoint(t, phase) {
      const angle = t * Math.PI * 2 * TURNS + phase;
      const y = (t - 0.5) * HEIGHT;
      return new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
    }

    function buildStrand(phase, color) {
      const pts = [];
      for (let i = 0; i <= SEGMENTS; i++) pts.push(helixPoint(i / SEGMENTS, phase));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 });
      return new THREE.Line(geo, mat);
    }

    helixGroup.add(buildStrand(0, 0xc5a26f));
    helixGroup.add(buildStrand(Math.PI, 0x8fa6c4));

    // Rungs connecting the two strands
    const rungMat = new THREE.LineBasicMaterial({ color: 0x8fa6c4, transparent: true, opacity: 0.2 });
    const RUNGS = 34;
    for (let i = 0; i <= RUNGS; i++) {
      const t = i / RUNGS;
      const a = helixPoint(t, 0);
      const b = helixPoint(t, Math.PI);
      const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
      helixGroup.add(new THREE.Line(geo, rungMat));
    }

    // --- Clickable category nodes, spaced along the helix ---
    const nodeMeshes = [];
    const labelEls = [];

    DATA.forEach((nodeData, i) => {
      const t = (i + 0.5) / DATA.length;
      const phase = i % 2 === 0 ? 0 : Math.PI;
      const pos = helixPoint(t, phase);

      const geo = new THREE.SphereGeometry(0.22, 24, 24);
      const mat = new THREE.MeshBasicMaterial({ color: nodeData.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.userData = { id: nodeData.id, baseScale: 1, pulse: 0 };
      helixGroup.add(mesh);
      nodeMeshes.push(mesh);

      const label = document.createElement("div");
      label.className = "dna-label";
      label.textContent = nodeData.label;
      label.addEventListener("click", () => window.openDnaModal(nodeData.id));
      wrap.appendChild(label);
      labelEls.push(label);
    });

    // --- Raycasting for click-to-highlight on the 3D nodes themselves ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerDown(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);
      if (hits.length) {
        const mesh = hits[0].object;
        mesh.userData.pulse = 1;
        window.openDnaModal(mesh.userData.id);
      }
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // --- Resize handling ---
    function onResize() {
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", onResize);

    // --- Animation loop ---
    const clock = new THREE.Clock();
    const rotateSpeed = prefersReducedMotion ? 0.02 : 0.09;

    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      universe.rotation.y += rotateSpeed * dt;
      coreGroup.rotation.y -= rotateSpeed * 1.6 * dt;
      coreGroup.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.04);

      nodeMeshes.forEach((mesh, i) => {
        const targetScale = 1 + mesh.userData.pulse * 0.9 + Math.max(0, Math.sin(elapsed * 2 + i)) * 0.06;
        mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.15));
        mesh.userData.pulse *= 0.9;
      });

      controls.update();
      renderer.render(scene, camera);

      // Project node positions to screen space for HTML labels
      nodeMeshes.forEach((mesh, i) => {
        const v = new THREE.Vector3();
        mesh.getWorldPosition(v);
        v.project(camera);
        const x = (v.x * 0.5 + 0.5) * width;
        const y = (-v.y * 0.5 + 0.5) * height;
        const label = labelEls[i];
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.style.opacity = v.z > 1 ? "0" : "1";
      });
    }
    animate();
  }
})();
