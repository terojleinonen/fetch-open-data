"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './TypewriterScene.module.css';

// Minimal 3D intro: typewriter plane -> camera pans up to reveal map plane with clickable glowing dots
export default function TypewriterScene({ onReady } = {}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = styles.canvas;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // scene & camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0b, 0.002);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 6, 14);
    camera.lookAt(0, 0, 0);

    // lights
    const amb = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffe6c7, 0.9);
    dir.position.set(-10, 20, 10);
    scene.add(dir);

    // load texture (typewriter image used as desk/typewriter plane)
    const loader = new THREE.TextureLoader();
    const baseTex = loader.load('/stephen-king-2024.jpg');

    // typewriter plane in foreground
    const planeGeo = new THREE.PlaneGeometry(18, 10);
    const planeMat = new THREE.MeshStandardMaterial({ map: baseTex });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(0, 0, 0);
    plane.rotation.x = -0.08;
    scene.add(plane);

    // map plane - a little behind and higher; we'll 'reveal' it by moving the camera up
    const mapPlaneGeo = new THREE.PlaneGeometry(28, 16);
    const mapMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, transparent: true, opacity: 0.96 });
    const mapPlane = new THREE.Mesh(mapPlaneGeo, mapMat);
    mapPlane.position.set(0, -8, -6);
    mapPlane.rotation.x = -0.18;
    scene.add(mapPlane);

    // Add glowing dots on the map
    const towns = [
      { name: 'Derry', pos: [4, -7.2, -5.5], link: '/pages/shorts' },
      { name: 'Castle Rock', pos: [-2.5, -6.4, -5.2], link: '/pages/books' },
      { name: "Jerusalem's Lot", pos: [8, -6.6, -5.6], link: '/pages/villains' },
    ];

    const dotGroup = new THREE.Group();
    towns.forEach((t, i) => {
      const g = new THREE.Group();
      const geom = new THREE.SphereGeometry(0.22, 16, 12);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffddaa });
      const dot = new THREE.Mesh(geom, mat);
      dot.position.set(...t.pos);
      g.add(dot);

      // glow sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: createRadialSprite(),
        color: 0xffa86b,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.1, 2.1, 1);
      sprite.position.set(t.pos[0], t.pos[1], t.pos[2] - 0.02);
      g.add(sprite);

      g.userData = { link: t.link, name: t.name };
      dotGroup.add(g);
    });
    scene.add(dotGroup);

    // raycaster for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(dotGroup.children, true);
      if (intersects.length) {
        const g = intersects[0].object.parent || intersects[0].object;
        if (g && g.userData && g.userData.link) window.location.href = g.userData.link;
      }
    }
    renderer.domElement.addEventListener('click', onClick, { passive: true });

    // animation loop: small bob + camera pan
    let raf = null;
    let start = performance.now();
    const panStart = start + 1600; // start panning after typing animation
    function animate(now) {
      const t = (now - start) / 1000;
      // subtle bob for plane
      plane.position.y = Math.sin(t * 0.4) * 0.08;
      // animate sprite intensities
      dotGroup.children.forEach((g, i) => {
        const s = g.children.find(c => c.type === 'Sprite');
        if (s) s.material.opacity = 0.6 + Math.abs(Math.sin(t * (0.8 + i * 0.2))) * 0.6;
      });

      // camera pan up over 6s when time > panStart
      if (now > panStart) {
        const dt = Math.min(1, (now - panStart) / 6000);
        camera.position.lerp(new THREE.Vector3(0, 10, 18), dt * 0.7);
        camera.lookAt(0, -2, -2);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    // handle resize
    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // cleanup
    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };

    // helper: radial sprite canvas
    function createRadialSprite() {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(size / 2, size / 2, 1, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255,200,150,1)');
      grad.addColorStop(0.2, 'rgba(255,150,80,0.9)');
      grad.addColorStop(0.5, 'rgba(255,120,50,0.6)');
      grad.addColorStop(1, 'rgba(255,120,50,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }

  }, []);

  // small DOM typewriter text overlay (keeps accessibility and easier text animation)
  useEffect(() => {
    const full = 'Welcome to the Stephen King Universe. Where every story begins in the ordinary... and ends in the unimaginable.';
    let i = 0;
    let t = null;
    function type() {
      setTyped(full.slice(0, i));
      i += 1;
      if (i <= full.length) t = setTimeout(type, 40 + Math.random() * 40);
    }
    type();
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className={styles.sceneRoot}>
      <div className={styles.overlay} aria-hidden="false">
        <div className={styles.paperTitle}>WELCOME TO</div>
        <div className={styles.paperTitle} style={{ fontSize: 'clamp(30px, 5.6vw, 72px)' }}>THE STEPHEN KING UNIVERSE</div>
        <div className={styles.typewriterText}>{typed}<span style={{ opacity: 0.9 }}>▌</span></div>
      </div>
    </div>
  );
}
