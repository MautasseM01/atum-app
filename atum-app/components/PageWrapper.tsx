import React from 'react';

export default function PageWrapper({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, position: 'relative', zIndex: 1, ...style }}>
      {children}
    </div>
  );
}
