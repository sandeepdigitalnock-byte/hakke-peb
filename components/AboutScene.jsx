'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Small looping 3D wireframe: a PEB frame draws itself, then slowly rotates. Reacts to the mouse.
export default function AboutScene() {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 300);
    cam.position.set(46, 26, 58);
    cam.lookAt(0, 3, 0);
    const group = new THREE.Group();
    scene.add(group);

    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const FZ = [0, 1, 2, 3, 4, 5].map((i) => -30 + 12 * i);
    const main = [], second = [];
    FZ.forEach((z) => main.push(V(-15, 0, z), V(-15, 6, z), V(-15, 6, z), V(0, 7.5, z), V(0, 7.5, z), V(15, 6, z), V(15, 6, z), V(15, 0, z)));
    [-15, 15].forEach((x) => [0, 6].forEach((y) => second.push(V(x, y, -30), V(x, y, 30))));
    second.push(V(0, 7.5, -30), V(0, 7.5, 30));
    [0.25, 0.5, 0.75].forEach((t) => [-1, 1].forEach((sg) => second.push(V(sg * 15 * (1 - t), 6 + 1.5 * t, -30), V(sg * 15 * (1 - t), 6 + 1.5 * t, 30))));
    [2, 4].forEach((y) => [-15, 15].forEach((x) => second.push(V(x, y, -30), V(x, y, 30))));
    [-1, 1].forEach((sg) => { second.push(V(sg * 15, 0, -30), V(sg * 15, 6, -18), V(sg * 15, 6, -30), V(sg * 15, 0, -18)); });

    const mk = (pts, color) => {
      const l = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 }));
      l.userData.n = pts.length;
      group.add(l);
      return l;
    };
    const a = mk(main, 0x0b6fb5), b = mk(second, 0x7fb4e0);
    const grid = new THREE.GridHelper(120, 24, 0x9db8d3, 0xc9d8e6);
    grid.position.y = -0.05;
    group.add(grid);
    group.position.y = -1;
    group.scale.setScalar(0.9);

    const size = () => {
      const w = el.clientWidth || 300, h = el.clientHeight || 300;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();

    let tx = 0, ty = 0, visible = true, raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 0.3;
    };
    el.addEventListener('pointermove', onMove);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let ry = 0.5;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const p = reduce ? 1 : Math.min(1, (t % 9) / 5); // draw for 5s, then hold and rotate
      a.geometry.setDrawRange(0, Math.floor((a.userData.n * Math.min(1, p * 1.6)) / 2) * 2);
      b.geometry.setDrawRange(0, Math.floor((b.userData.n * Math.max(0, p * 1.6 - 0.6)) / 2) * 2);
      if (!reduce) ry += 0.0035;
      group.rotation.y += (ry + tx - group.rotation.y) * 0.06;
      group.rotation.x += (ty - group.rotation.x) * 0.06;
      renderer.render(scene, cam);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointermove', onMove);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className="h-[260px] w-full sm:h-[320px]" aria-hidden="true" />;
}
