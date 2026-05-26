'use client';

import { useState } from 'react';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value, onChange, onSubmit,
  placeholder = 'Search any word to find its root...',
  autoFocus = false,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 610,
      borderRadius: 13,
      background: focused ? 'rgba(22, 27, 34, 0.95)' : 'rgba(22, 27, 34, 0.8)',
      border: `1px solid ${focused ? 'rgba(243, 156, 18, 0.5)' : 'rgba(48, 54, 61, 0.6)'}`,
      boxShadow: focused ? '0 0 30px rgba(243, 156, 18, 0.15), 0 0 60px rgba(243, 156, 18, 0.05)' : 'none',
      transition: 'all 377ms ease',
    }}>
      <span style={{
        position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
        fontSize: '18px', color: '#8b949e', pointerEvents: 'none',
      }}>
        ⌕
      </span>
      <input
        type="text"
        value={value || ''}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onSubmit) onSubmit(value || ''); }}
        style={{
          width: '100%', padding: '16px 24px 16px 50px',
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: "'Source Serif 4', serif",
          fontSize: 18, color: '#e6edf3',
        }}
      />
    </div>
  );
}
