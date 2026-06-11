'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import ibdalData from '@/data/ibdalRules.json';

interface Rule {
  id: string; letter1: string; letter2: string;
  letter1Latin: string; letter2Latin: string;
  makhrajGroup1: string; makhrajGroup2: string;
  makhrajDistance: string;
  exampleWordL1?: string; exampleWordL2?: string;
  notes?: string;
}

interface NodeData {
  id: string;
  letter: string;
  latinName: string;
  primaryMakhraj: string;
  degree: number;
}

interface EdgeData {
  source: string; target: string;
  distance: string; ruleId: string;
  note: string; exampleL1: string; exampleL2: string;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string; letter: string; latinName: string;
  primaryMakhraj: string; degree: number;
}

interface SimEdge extends d3.SimulationLinkDatum<SimNode> {
  distance: string; ruleId: string;
  note: string; exampleL1: string; exampleL2: string;
}

const MAKHRAJ_MAP: Record<string, { en: string; color: string }> = {
  'حلقي': { en: 'Pharyngeal/Glottal', color: '#EF4444' },
  'حنكي': { en: 'Palatal', color: '#8B5CF6' },
  'لهوي': { en: 'Velar/Uvular', color: '#F59E0B' },
  'شفوي': { en: 'Labial', color: '#3B82F6' },
  'أسناني': { en: 'Dental/Interdental', color: '#22C55E' },
  'عام': { en: 'General', color: '#8B949E' },
};

const DIST_COLORS: Record<string, string> = {
  'قريب': 'rgba(34,197,94,0.5)',
  'متوسط': 'rgba(250,204,21,0.4)',
  'بعيد': 'rgba(239,68,68,0.3)',
};

export default function IbdalNetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: SimEdge | null }>({ x: 0, y: 0, data: null });
  const [dimensions, setDimensions] = useState({ width: 900, height: 700 });

  useEffect(() => {
    const rules: Rule[] = (ibdalData as { rules: Rule[] }).rules;

    // Build nodes: assign primary makhraj per letter by majority vote
    const makhrajCounts: Record<string, Record<string, number>> = {};
    const letterLatin: Record<string, string> = {};
    rules.forEach(r => {
      for (const [letter, group] of [[r.letter1, r.makhrajGroup1], [r.letter2, r.makhrajGroup2]] as const) {
        if (!makhrajCounts[letter]) makhrajCounts[letter] = {};
        makhrajCounts[letter][group] = (makhrajCounts[letter][group] || 0) + 1;
      }
      letterLatin[r.letter1] = r.letter1Latin;
      letterLatin[r.letter2] = r.letter2Latin;
    });

    const allLetters = [...new Set(rules.flatMap(r => [r.letter1, r.letter2]))];
    // Filter out non-letter entries
    const letterNodes = allLetters.filter(l => l !== '—' && l.length === 1 && /[\u0600-\u06FF]/.test(l));

    const nodeMap = new Map<string, SimNode>();
    letterNodes.forEach(letter => {
      const counts = makhrajCounts[letter] || {};
      const primaryGroup = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'عام';
      nodeMap.set(letter, {
        id: letter,
        letter,
        latinName: letterLatin[letter] || letter,
        primaryMakhraj: primaryGroup,
        degree: 0,
      });
    });

    // Build edges
    const edges: SimEdge[] = [];
    rules.forEach(r => {
      if (r.letter1 === '—' || r.letter2 === '—') return;
      if (!nodeMap.has(r.letter1) || !nodeMap.has(r.letter2)) return;
      const l1 = r.letter1Latin === 'hamza' ? 'hamza' : r.letter1Latin;
      const l2 = r.letter2Latin === 'hamza' ? 'hamza' : r.letter2Latin;
      edges.push({
        source: r.letter1,
        target: r.letter2,
        distance: r.makhrajDistance || '—',
        ruleId: r.id,
        note: r.notes || '',
        exampleL1: r.exampleWordL1 || '',
        exampleL2: r.exampleWordL2 || '',
      });
    });

    // Compute degree
    edges.forEach(e => {
      const s = nodeMap.get(e.source as string);
      const t = nodeMap.get(e.target as string);
      if (s) s.degree++;
      if (t) t.degree++;
    });

    const nodes = [...nodeMap.values()];

    // D3 setup
    const svg = d3.select(svgRef.current!);
    svg.selectAll('*').remove();
    const container = containerRef.current!;
    const width = container.clientWidth || 900;
    const height = Math.max(700, window.innerHeight * 0.75);
    setDimensions({ width, height });

    svg.attr('width', width).attr('height', height);
    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => { g.attr('transform', event.transform); });
    svg.call(zoom);

    // Simulation
    const sim = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimEdge>(edges).id(d => d.id).distance(80).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<SimNode>().radius(d => 15 + Math.sqrt(d.degree) * 4));

    // Edges
    const link = g.append('g')
      .selectAll<SVGLineElement, SimEdge>('line')
      .data(edges)
      .join('line')
      .attr('stroke', d => DIST_COLORS[d.distance] || 'rgba(139,148,158,0.2)')
      .attr('stroke-width', 1.5)
      .attr('stroke-linecap', 'round')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left + 12,
          y: event.clientY - rect.top - 12,
          data: d,
        });
      })
      .on('mousemove', (event) => {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip(prev => ({
          ...prev,
          x: event.clientX - rect.left + 12,
          y: event.clientY - rect.top - 12,
        }));
      })
      .on('mouseleave', () => {
        setTooltip({ x: 0, y: 0, data: null });
      });

    // Nodes
    const node = g.append('g')
      .selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'grab')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      );

    // Node circles
    node.append('circle')
      .attr('r', d => 10 + Math.sqrt(d.degree) * 3)
      .attr('fill', d => MAKHRAJ_MAP[d.primaryMakhraj]?.color || '#8B949E')
      .attr('stroke', '#0a0a0f')
      .attr('stroke-width', 2)
      .style('opacity', 0.9);

    // Node labels: Arabic
    node.append('text')
      .text(d => d.letter)
      .attr('dy', -4)
      .attr('text-anchor', 'middle')
      .attr('font-family', "'Amiri', serif")
      .attr('font-size', d => 14 + Math.sqrt(d.degree) * 2)
      .attr('fill', '#e6edf3')
      .attr('direction', 'rtl');

    // Node labels: Latin
    node.append('text')
      .text(d => d.latinName)
      .attr('dy', d => 14 + Math.sqrt(d.degree) * 3 + 14)
      .attr('text-anchor', 'middle')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('font-size', 10)
      .attr('fill', '#8b949e')
      .style('opacity', 0.8);

    // Simulation tick
    sim.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x!)
        .attr('y1', d => (d.source as SimNode).y!)
        .attr('x2', d => (d.target as SimNode).x!)
        .attr('y2', d => (d.target as SimNode).y!);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => { sim.stop(); };
  }, []);

  return (
    <div>
      <div ref={containerRef} style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 13, border: '1px solid rgba(48,54,61,0.4)', background: 'rgba(10,10,15,0.8)' }}>
        <svg ref={svgRef} style={{ display: 'block', width: '100%', height: 'auto', minHeight: 600 }} />
        {tooltip.data && (
          <div style={{
            position: 'absolute', left: tooltip.x, top: tooltip.y,
            background: 'rgba(22,27,34,0.95)', border: '1px solid rgba(48,54,61,0.6)',
            borderRadius: 8, padding: '10px 14px', pointerEvents: 'none',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: '#e6edf3', zIndex: 100, maxWidth: 320,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <div style={{ color: '#f39c12', marginBottom: 4 }}>
              #{tooltip.data.ruleId}: {tooltip.data.source as string} ↔ {tooltip.data.target as string}
            </div>
            <div style={{ color: '#8b949e', fontSize: 11, marginBottom: 2 }}>
              {(tooltip.data.source as SimNode).latinName} ↔ {(tooltip.data.target as SimNode).latinName}
            </div>
            {tooltip.data.note && <div style={{ color: '#8b949e', fontSize: 11, marginTop: 4 }}>{tooltip.data.note}</div>}
            <div style={{ marginTop: 4, fontSize: 11 }}>
              Distance: <span style={{ color: DIST_COLORS[tooltip.data.distance] ? '#e6edf3' : '#8b949e' }}>{tooltip.data.distance}</span>
            </div>
            {tooltip.data.exampleL1 && tooltip.data.exampleL2 && (
              <div style={{ marginTop: 4, fontSize: 11, color: '#8b949e' }}>
                Ex: {tooltip.data.exampleL1} / {tooltip.data.exampleL2}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
