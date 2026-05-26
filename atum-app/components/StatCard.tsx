'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  delay?: number;
}

export default function StatCard({ value, label, prefix = '', suffix = '', color = '#e6edf3', delay = 0 }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const lastVal = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  const isInt = Number.isInteger(lastVal);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const start = Date.now();
        const dur = 1200;
        const timer = setInterval(() => {
          const progress = Math.min((Date.now() - start - delay) / dur, 1);
          if (progress < 0) return;
          const ease = 1 - Math.pow(1 - progress, 3);
          setDisplay(lastVal * ease);
          if (progress >= 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const formatted = isInt
    ? Math.round(display).toLocaleString()
    : display.toFixed(String(value).includes('.') ? String(value).split('.')[1].length : 1);

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center', padding: '21px',
        background: 'rgba(22, 27, 34, 0.6)',
        border: '1px solid rgba(48,54,61,0.4)',
        borderRadius: 13, flex: 1, minWidth: 140,
      }}
    >
      <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 34, color, fontWeight: 700, lineHeight: 1.2 }}>
        {prefix}{formatted}{suffix}
      </div>
      <div style={{
        fontSize: 13, color: '#8b949e', marginTop: 8,
        textTransform: 'uppercase', letterSpacing: '1.5px',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {label}
      </div>
    </div>
  );
}
