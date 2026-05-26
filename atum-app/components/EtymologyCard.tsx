'use client';

import { useState } from 'react';
import React from 'react';
import RootBadge from './RootBadge';
import ConfidenceBadge from './ConfidenceBadge';

interface EtymologyCardWord {
  id?: string;
  european: string;
  arabicRoot: string;
  transliteration?: string;
  rule?: string;
  meaning?: string;
  rootId: string;
  confidence: string;
  path?: string;
  languages?: string[];
}

interface EtymologyCardProps {
  word: EtymologyCardWord;
  onClick?: () => void;
  expanded?: boolean;
}

const rootColors: Record<string, string> = {
  ATUM: '#22C55E', BULL: '#EF4444', TOR: '#3B82F6',
};

export default function EtymologyCard({ word, onClick, expanded = false }: EtymologyCardProps) {
  const root = rootColors[word.rootId?.toUpperCase()] || '#8b949e';
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: expanded ? 'rgba(28, 33, 40, 0.95)' : 'rgba(22, 27, 34, 0.8)',
        border: `1px solid ${expanded ? root + '44' : 'rgba(48, 54, 61, 0.5)'}`,
        borderRadius: 13, padding: expanded ? '34px' : '21px',
        cursor: 'pointer',
        transition: 'all 377ms ease',
        position: 'relative', overflow: 'hidden',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? `0 8px 30px ${root}15` : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
        background: root, borderRadius: '3px 0 0 3px',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 28, color: '#e6edf3', marginBottom: 8, letterSpacing: '1px' }}>
          {word.european}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ConfidenceBadge level={word.confidence} showLabel={false} />
          <RootBadge rootId={word.rootId} size="sm" />
        </div>
      </div>

      <div style={{ fontFamily: "'Amiri', serif", direction: 'rtl', fontSize: 24, color: '#f39c12', marginBottom: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>← </span>
        <span style={{ fontFamily: "'Amiri', serif" }}>{word.arabicRoot}</span>
        {word.transliteration && (
          <span style={{ fontSize: 14, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace", direction: 'ltr' }}>
            ({word.transliteration})
          </span>
        )}
      </div>

      {word.rule && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13, color: '#22C55E',
          padding: '6px 12px', background: 'rgba(34, 197, 94, 0.08)',
          borderRadius: 8, marginBottom: 13, display: 'inline-block',
        }}>
          {word.rule}
        </div>
      )}

      {expanded && (
        <>
          {word.meaning && (
            <div style={{ fontSize: 15, color: '#8b949e', fontStyle: 'italic', marginBottom: 13 }}>
              &ldquo;{word.meaning}&rdquo;
            </div>
          )}
          {word.path && (
            <div style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: 14, color: '#8b949e', lineHeight: 1.8,
              padding: '13px 0', borderTop: '1px solid rgba(48,54,61,0.5)',
              marginTop: 13,
            }}>
              <div style={{ color: '#e6edf3', fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Language Path
              </div>
              {word.path}
            </div>
          )}
          {word.languages && word.languages.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 13, flexWrap: 'wrap' }}>
              {word.languages.map(l => (
                <span key={l} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 21, background: 'rgba(48,54,61,0.5)', color: '#8b949e' }}>
                  {l}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
