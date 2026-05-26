'use client';

import { useEffect, useRef } from 'react';
import TorusField from '@/lib/torus';

export default function TorusCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const torusRef = useRef<TorusField | null>(null);

  useEffect(() => {
    if (canvasRef.current && !torusRef.current) {
      torusRef.current = new TorusField(canvasRef.current, {
        particleCount: 1400,
        speed: 1,
        glowIntensity: 1,
      });
    }
    return () => {
      if (torusRef.current) torusRef.current.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity: 0.7, zIndex: 0,
      }}
    />
  );
}
