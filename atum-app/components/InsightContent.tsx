'use client';

import React from 'react';

interface Props {
  content: string;
}

interface Block {
  type: 'h2' | 'h3' | 'ul' | 'p' | 'hr';
  text?: string;
  items?: string[];
}

function parseBlocks(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^---\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    if (/^##\s+/.test(line)) {
      blocks.push({ type: 'h2', text: line.replace(/^##\s+/, '').trim() });
      i++;
      continue;
    }

    if (/^###\s+/.test(line)) {
      blocks.push({ type: 'h3', text: line.replace(/^###\s+/, '').trim() });
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, '').trim());
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,3}\s+/.test(lines[i]) && !/^---\s*$/.test(lines[i]) && !/^[-*]\s+/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'p', text: paraLines.join(' ').trim() });
    }
  }

  return blocks;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIdx = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(text.slice(lastIdx, m.index));
    }
    const tok = m[0];
    if (tok.startsWith('**')) {
      parts.push(<strong key={key++} style={{ color: '#e6edf3' }}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith('`')) {
      parts.push(<code key={key++} style={{ fontFamily: "'JetBrains Mono', monospace", background: 'rgba(48,54,61,0.5)', padding: '2px 6px', borderRadius: 4, fontSize: '0.92em' }}>{tok.slice(1, -1)}</code>);
    } else {
      parts.push(<em key={key++} style={{ color: '#8b949e' }}>{tok.slice(1, -1)}</em>);
    }
    lastIdx = m.index + tok.length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

export default function InsightContent({ content }: Props) {
  const blocks = parseBlocks(content);

  return (
    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#8b949e' }}>
      {blocks.map((b, idx) => {
        if (b.type === 'h2') {
          return (
            <h2 key={idx} style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 18, color: '#f39c12', marginTop: 28, marginBottom: 10,
              letterSpacing: '0.5px',
            }}>
              {b.text}
            </h2>
          );
        }
        if (b.type === 'h3') {
          return (
            <h3 key={idx} style={{ fontSize: 15, color: '#e6edf3', marginTop: 18, marginBottom: 8, fontWeight: 600 }}>
              {b.text}
            </h3>
          );
        }
        if (b.type === 'ul') {
          return (
            <ul key={idx} style={{ paddingLeft: 22, margin: '8px 0 14px', listStyle: 'disc' }}>
              {(b.items || []).map((it, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        }
        if (b.type === 'hr') {
          return <hr key={idx} style={{ border: 0, borderTop: '1px solid rgba(48,54,61,0.4)', margin: '20px 0' }} />;
        }
        return <p key={idx} style={{ margin: '8px 0 12px' }}>{renderInline(b.text || '')}</p>;
      })}
    </div>
  );
}
