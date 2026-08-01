"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function OrbitalGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0x00f5ff,
        emissive: 0x00f5ff,
        emissiveIntensity: 0.5,
        shininess: 100,
      }),
    );
    group.add(core);

    const createRing = (
      radius: number,
      color: number,
      rotationX: number,
      rotationY: number,
    ) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 16, 100),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.4,
        }),
      );
      ring.rotation.x = rotationX;
      ring.rotation.y = rotationY;
      group.add(ring);
      return ring;
    };

    const ring1 = createRing(1.2, 0x00f5ff, Math.PI / 2, 0.2);
    const ring2 = createRing(1.5, 0x8b5cf6, 0.5, Math.PI / 4);
    const ring3 = createRing(1.8, 0x39393d, -0.3, 0.1);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0x00f5ff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 4;

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      group.rotation.x += 0.002;
      ring1.rotation.z += 0.01;
      ring2.rotation.z -= 0.008;
      ring3.rotation.z += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full scale-125"
      aria-hidden
    />
  );
}
