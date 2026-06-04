'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import TorusField from '@/lib/torus';

export default function TorusCanvas() {
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<TorusField | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    // Fast WebGL detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn("WebGL not supported, falling back to 2D TorusField.");
        setWebglFailed(true);
        return;
      }
    } catch {
      setWebglFailed(true);
      return;
    }

    if (webglFailed || !webglCanvasRef.current) return;

    let animationId: number;
    let renderer: THREE.WebGLRenderer;
    let geometry: THREE.BufferGeometry;
    let material: THREE.ShaderMaterial;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 35;

      renderer = new THREE.WebGLRenderer({ canvas: webglCanvasRef.current, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Build Geometry
      const particleCount = 6000;
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const radius = 12;
      const tube = 4.5;

      const colorAtum = new THREE.Color('#22C55E');
      const colorBull = new THREE.Color('#EF4444');
      const colorTor = new THREE.Color('#3B82F6');

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;

        const x = (radius + tube * Math.cos(v)) * Math.cos(u);
        const y = (radius + tube * Math.cos(v)) * Math.sin(u);
        const z = tube * Math.sin(v);

        // Add some noise
        const noise = 0.9;
        positions[i * 3] = x + (Math.random() - 0.5) * noise;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * noise;
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * noise;

        const angle = (u + Math.PI * 2) % (Math.PI * 2);
        let mixColor;
        // Divide torus into 3 equal sections
        if (angle < (Math.PI * 2) / 3) mixColor = colorAtum;
        else if (angle < (Math.PI * 4) / 3) mixColor = colorBull;
        else mixColor = colorTor;

        colors[i * 3] = mixColor.r;
        colors[i * 3 + 1] = mixColor.g;
        colors[i * 3 + 2] = mixColor.b;

        sizes[i] = Math.random() * 2.0 + 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float pixelRatio;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = (0.5 - dist) * 2.0;
            gl_FragColor = vec4(vColor, alpha * 0.8);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(geometry, material);
      particles.rotation.x = Math.PI / 2.5;
      scene.add(particles);

      let time = 0;
      const render = () => {
        time += 0.003;
        particles.rotation.z = time * 0.3;
        material.uniforms.time.value = time;
        
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(render);
      };
      render();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    } catch (err) {
      console.error("Three.js initialization failed:", err);
      setWebglFailed(true);
    }
  }, [webglFailed]);

  // Fallback 2D canvas execution
  useEffect(() => {
    if (webglFailed && fallbackCanvasRef.current && !fallbackRef.current) {
      fallbackRef.current = new TorusField(fallbackCanvasRef.current, {
        particleCount: 1400,
        speed: 1,
        glowIntensity: 1,
      });
    }
    return () => {
      if (fallbackRef.current) {
        fallbackRef.current.destroy();
        fallbackRef.current = null;
      }
    };
  }, [webglFailed]);

  return (
    <>
      {!webglFailed && (
        <canvas
          ref={webglCanvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: 0.9, zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      {webglFailed && (
        <canvas
          ref={fallbackCanvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: 0.7, zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
