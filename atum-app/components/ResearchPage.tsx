'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import Footer from '@/components/Footer';

interface WordItem {
  id: string; european: string; arabicRoot: string; rootId: string; rule: string;
  meaning: string; confidence: string; path: string; languages: string[];
}

interface ResearchPageProps { locale: string; words: WordItem[]; }

function NetworkGraph({ words }: { words: WordItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 450 });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDims({ w: rect.width, h: Math.min(rect.width * 0.55, 500) });
    }
  }, []);

  const nodes = useMemo(() => {
    const roots = [
      { id: 'ATUM', x: 0.3, y: 0.4, r: 28, color: '#22C55E', label: 'ATUM', rootId: 'ATUM' as string | undefined },
      { id: 'BULL', x: 0.7, y: 0.35, r: 28, color: '#EF4444', label: 'BULL', rootId: 'BULL' as string | undefined },
      { id: 'TOR', x: 0.5, y: 0.75, r: 28, color: '#3B82F6', label: 'TOR', rootId: 'TOR' as string | undefined },
    ];
    const wordNodes = words.slice(0, 100).map((w, i) => {
      const root = roots.find(r => r.id === w.rootId) || roots[0];
      const goldenAngle = i * 2.399963;
      const dist = 0.12 + (i * 0.618 % 0.22);
      return {
        id: w.id, x: root.x + Math.cos(goldenAngle) * dist,
        y: root.y + Math.sin(goldenAngle) * dist,
        r: 8 + (w.confidence === 'proven' ? 4 : w.confidence === 'strong' ? 2 : 0),
        color: root.color, label: w.european, rootId: w.rootId,
      };
    });
    return [...roots, ...wordNodes];
  }, [words]);

  const edges = useMemo(() =>
    words.slice(0, 100).map(w => ({ from: w.rootId, to: w.id, rootId: w.rootId })),
  [words]);

  return (
    <div ref={containerRef} style={{ background: 'rgba(22,27,34,0.4)', border: '1px solid rgba(48,54,61,0.4)', borderRadius: 21, padding: 21, overflow: 'hidden' }}>
      <div style={{ fontSize: 13, color: '#484f58', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginBottom: 13 }}>
        Root Network
      </div>
      <svg width={dims.w - 42} height={dims.h} viewBox={`0 0 ${dims.w - 42} ${dims.h}`}>
        {edges.map((e, i) => {
          const from = nodes.find(n => n.id === e.from);
          const to = nodes.find(n => n.id === e.to);
          if (!from || !to) return null;
          const isHighlight = hovered === e.from || hovered === e.to;
          return (
            <line
              key={`e-${i}`}
              x1={from.x * (dims.w - 42)} y1={from.y * dims.h}
              x2={to.x * (dims.w - 42)} y2={to.y * dims.h}
              stroke={from.color}
              strokeWidth={isHighlight ? 1.5 : 0.6}
              strokeOpacity={isHighlight ? 0.6 : 0.15}
            />
          );
        })}
        {nodes.map(n => {
          const isHighlight = hovered === n.id || hovered === n.rootId;
          const isRoot = ['ATUM', 'BULL', 'TOR'].includes(n.id);
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={n.x * (dims.w - 42)} cy={n.y * dims.h} r={n.r}
                fill={isRoot ? `${n.color}33` : `${n.color}${isHighlight ? '44' : '22'}`}
                stroke={n.color}
                strokeWidth={isRoot ? 2 : (isHighlight ? 1.5 : 0.5)}
                strokeOpacity={isHighlight || isRoot ? 1 : 0.4}
              />
              {isRoot && (
                <text x={n.x * (dims.w - 42)} y={n.y * dims.h + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={n.color} fontSize={11} fontWeight={700}
                  fontFamily="'Cinzel Decorative', serif" letterSpacing="1px"
                >
                  {n.label}
                </text>
              )}
              {!isRoot && (isHighlight || n.r > 10) && (
                <text x={n.x * (dims.w - 42)} y={n.y * dims.h - n.r - 6}
                  textAnchor="middle" fill="#e6edf3" fontSize={10}
                  fontFamily="'Source Serif 4', serif"
                >
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ResearchTimeline() {
  const events = [
    { year: '2019', title: 'Initial Corpus', desc: 'Arabic-European word pairs collected' },
    { year: '2020', title: 'Root Discovery', desc: 'ATUM/BULL/TOR pattern identified' },
    { year: '2021', title: 'CNN Training', desc: 'Neural network trained on letter patterns' },
    { year: '2022', title: '99.7% Accuracy', desc: 'CNN achieves near-perfect classification' },
    { year: '2023', title: 'Ibdal Rules', desc: 'Systematic letter transformation rules mapped' },
    { year: '2024', title: '96 Proven', desc: 'Statistical confirmation of root connections' },
    { year: '2025', title: 'Cross-Language', desc: '5 source languages analyzed systematically' },
    { year: '2026', title: 'Public Release', desc: 'ATUM platform opens for exploration' },
  ];
  const colors = ['#22C55E', '#3B82F6', '#EF4444', '#f39c12', '#22C55E', '#3B82F6', '#EF4444', '#f39c12'];

  return (
    <div style={{ background: 'rgba(22,27,34,0.4)', border: '1px solid rgba(48,54,61,0.4)', borderRadius: 21, padding: '21px 0', overflow: 'hidden' }}>
      <div style={{ fontSize: 13, color: '#484f58', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginBottom: 21, paddingLeft: 21 }}>
        Research Timeline
      </div>
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', padding: '0 21px 13px', scrollbarWidth: 'thin' }}>
        {events.map((e, i) => (
          <div key={i} style={{ flex: '0 0 auto', width: 155, padding: '0 8px', borderLeft: `2px solid ${colors[i]}33`, position: 'relative' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i], position: 'absolute', left: -6, top: 0, boxShadow: `0 0 8px ${colors[i]}44` }} />
            <div style={{ fontSize: 12, color: colors[i], marginBottom: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
              {e.year}
            </div>
            <div style={{ fontSize: 14, color: '#e6edf3', marginBottom: 4 }}>{e.title}</div>
            <div style={{ fontSize: 12, color: '#484f58', lineHeight: 1.5 }}>{e.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceCards() {
  const sources = [
    { name: 'Wehr Dictionary', type: 'Arabic-English Lexicon', confidence: 'proven', count: 2840 },
    { name: 'Lane Lexicon', type: 'Classical Arabic Reference', confidence: 'proven', count: 1560 },
    { name: 'Etymonline', type: 'English Etymology Database', confidence: 'strong', count: 3200 },
    { name: 'Lisan al-Arab', type: 'Comprehensive Arabic Dictionary', confidence: 'proven', count: 980 },
    { name: 'Comparative Semitic', type: 'Cross-Language Analysis', confidence: 'strong', count: 420 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 13 }}>
      {sources.map(s => (
        <div key={s.name} style={{ background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)', borderRadius: 13, padding: 21 }}>
          <div style={{ fontSize: 15, color: '#e6edf3', marginBottom: 4 }}>{s.name}</div>
          <div style={{ fontSize: 12, color: '#484f58', marginBottom: 13 }}>{s.type}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ConfidenceBadge level={s.confidence} showLabel={false} />
            <span style={{ fontSize: 12, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace" }}>
              {s.count.toLocaleString()} entries
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResearchPage({ locale }: ResearchPageProps) {
  return (
    <>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title="Research Dashboard" subtitle="The computational linguistics and statistical evidence behind the three root theory." />

        <div style={{ display: 'flex', gap: 13, marginBottom: 55, flexWrap: 'wrap' }}>
          <StatCard value={99.7} label="CNN Accuracy" color="#22C55E" suffix="%" />
          <StatCard value={'<0.0001'} label="p-value" color="#3B82F6" prefix="p" />
          <StatCard value={'0.693'} label="Correlation" color="#EF4444" prefix="r=−" />
          <StatCard value={96} label="Proven" color="#f39c12" />
        </div>

        <div style={{ marginBottom: 34 }}>
          <NetworkGraph words={[]} />
        </div>

        <div style={{ marginBottom: 34 }}>
          <ResearchTimeline />
        </div>

        <div>
          <div style={{ fontSize: 13, color: '#484f58', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginBottom: 21 }}>
            Data Sources
          </div>
          <SourceCards />
        </div>
      </div>
      <Footer />
    </>
  );
}
