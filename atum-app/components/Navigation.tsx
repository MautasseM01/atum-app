'use client';

import React from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'letters', label: 'Letters' },
  { id: 'research', label: 'Research' },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 34px',
      background: 'rgba(10, 10, 15, 0.75)',
      backdropFilter: 'blur(21px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(21px) saturate(1.4)',
      borderBottom: '1px solid rgba(48, 54, 61, 0.4)',
      transition: 'background 377ms ease',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        onClick={() => onNavigate('home')}
      >
        <div aria-hidden="true" style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #22C55E 0%, #3B82F6 50%, #EF4444 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: '#fff',
          userSelect: 'none',
          flexShrink: 0,
        }}>
          ◈
        </div>
        <span style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 21, fontWeight: 700,
          background: 'linear-gradient(90deg, #22C55E, #3B82F6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '3px',
        }}>
          ATUM
        </span>
      </div>
      <div style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
        {pages.map(p => {
          const active = currentPage === p.id;
          return (
            <span
              key={p.id}
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: 14, color: active ? '#e6edf3' : '#8b949e',
                textDecoration: 'none', cursor: 'pointer',
                transition: 'color 233ms ease',
                borderBottom: active ? '2px solid #f39c12' : '2px solid transparent',
                paddingBottom: 4, letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
              onClick={() => onNavigate(p.id)}
              onMouseEnter={(e) => { if (!active) (e.target as HTMLElement).style.color = '#e6edf3'; }}
              onMouseLeave={(e) => { if (!active) (e.target as HTMLElement).style.color = '#8b949e'; }}
            >
              {p.label}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
