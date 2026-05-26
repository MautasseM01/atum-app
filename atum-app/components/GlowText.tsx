import React from 'react';

interface GlowTextProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  font?: 'display' | 'body' | 'arabic' | 'mono';
  style?: React.CSSProperties;
}

const fonts: Record<string, string> = {
  display: "'Cinzel Decorative', serif",
  body: "'Source Serif 4', serif",
  arabic: "'Amiri', serif",
  mono: "'JetBrains Mono', monospace",
};

export default function GlowText({ children, color = '#f39c12', size = 34, font = 'display', style: extra = {} }: GlowTextProps) {
  return (
    <div style={{
      fontFamily: fonts[font] || fonts.display,
      fontSize: size, color,
      textShadow: `0 0 20px ${color}66, 0 0 40px ${color}33`,
      lineHeight: 1.3,
      ...extra,
    }}>
      {children}
    </div>
  );
}
