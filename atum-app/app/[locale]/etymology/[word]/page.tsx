'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';
import RootBadge from '@/components/RootBadge';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import Pronunciation from '@/components/Pronunciation';
import Footer from '@/components/Footer';

interface WordData {
  id: string; european: string; arabicRoot: string; rootId: string;
  rule: string; meaning: string; confidence: string; language: string;
}

interface Concept {
  id: string; title: string; topic: string; content: string; sourceFile: string;
}

interface ScoredConcept extends Concept {
  relevance: number; matchType: string;
}

const ROOT_PRINCIPLES: Record<string, { principle: string; physics: string; daily: string[] }> = {
  ATUM: {
    principle: 'Unity · Inertia · Containment',
    physics: 'ATUM represents inertia — the tendency of matter to remain at rest or in uniform motion. Just as the atom is the indivisible unit of matter, أتم means "to complete, make whole." ATUM-root words describe things that are fundamental, unified, and self-contained.',
    daily: ['Your home (the container)', 'A completed task', 'The foundation of a building', 'An atom (indivisible unit)', 'Adam (from the earth)'],
  },
  BULL: {
    principle: 'Radiation · Expansion · Outward',
    physics: 'BULL represents radiation — energy expanding outward from a center. This is the principle of fire, light, and all wave propagation. بول means "to radiate, emit." BULL-root words describe things that expand, radiate, or burst forth.',
    daily: ['A ball (expanding sphere)', 'A boiling pot (heat expanding)', 'A blooming flower', 'Light radiating from a bulb', 'A bold action (energy outward)'],
  },
  TOR: {
    principle: 'Structure · Rotation · Cycles',
    physics: 'TOR represents toroidal/spiral dynamics — the most common energy pattern in the universe. From galaxies to hurricanes to DNA, energy follows toroidal paths. طور means "to turn, cycle." TOR-root words describe things that turn, cycle, or form structures.',
    daily: ['A tower (structured, rising)', 'A tour (circular journey)', 'A tornado (spiral wind)', 'A torque (rotational force)', 'A torus (donut shape)'],
  },
};

const LANGUAGE_DISPLAY: Record<string, string> = {
  GR: 'Greek', LA: 'Latin', EN: 'English', FR: 'French', AR: 'Arabic',
};

export default function WordPage() {
  const params = useParams();
  const router = useRouter();
  const wordSlug = params?.word as string;
  const locale = params?.locale as string || 'en';

  const [word, setWord] = useState<WordData | null>(null);
  const [concepts, setConcepts] = useState<ScoredConcept[]>([]);
  const [related, setRelated] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wordSlug) return;
    setLoading(true);
    fetch(`/api/etymology/search?q=${encodeURIComponent(wordSlug)}&limit=50`).then(r => r.json()).then(wordRes => {
      const results = wordRes.results || [];
      const found = results.find((r: WordData) => r.european.toLowerCase() === wordSlug.toLowerCase()) || results[0];
      setWord(found || null);
      if (found) {
        const sameRoot = results.filter((r: WordData) => r.rootId === found.rootId && r.id !== found.id);
        setRelated(sameRoot.slice(0, 10));
        fetch(`/api/concepts/related?root=${found.rootId}&word=${encodeURIComponent(found.european)}`).then(r => r.json()).then(cr => {
          setConcepts(cr.concepts || []);
        });
      }
    }).finally(() => setLoading(false));
  }, [wordSlug]);

  if (loading) {
    return (
      <div style={{ padding: '120px 34px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 55, marginBottom: 21, opacity: 0.4 }}>⟳</div>
        <div style={{ color: '#484f58', fontSize: 16 }}>Loading etymology...</div>
      </div>
    );
  }

  if (!word) {
    return (
      <div style={{ padding: '120px 34px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 55, marginBottom: 21, opacity: 0.4 }}>⌕</div>
        <div style={{ fontSize: 24, color: '#e6edf3', marginBottom: 8, fontFamily: "'Cinzel Decorative', serif" }}>
          Word not found
        </div>
        <div style={{ color: '#8b949e', marginBottom: 34 }}>
          No etymology data for &ldquo;{wordSlug}&rdquo;
        </div>
        <button onClick={() => router.push(`/${locale}/explorer`)}
          style={{ padding: '10px 34px', borderRadius: 21, border: '1px solid #f39c12', background: 'transparent', color: '#f39c12', cursor: 'pointer', fontSize: 14 }}>
          ← Back to Explorer
        </button>
      </div>
    );
  }

  const rootInfo = ROOT_PRINCIPLES[word.rootId];
  const langSteps = ['AR', 'GR', 'LA', 'EN', 'FR'];
  const langsBefore = langSteps.slice(0, langSteps.indexOf(word.language) + 1);

  return (
    <>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ padding: '120px 34px 89px', maxWidth: 900, margin: '0 auto' }}>
        {/* 1. HERO */}
        <section style={{ textAlign: 'center', marginBottom: 55, animation: 'fadeIn 0.6s ease' }}>
          <div style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(42px, 8vw, 72px)',
            color: '#e6edf3', lineHeight: 1.1, letterSpacing: '3px',
            marginBottom: 13,
          }}>
            {word.european}
          </div>
          {word.arabicRoot && (
            <div style={{
              fontFamily: "'Amiri', serif", fontSize: 48, color: '#f39c12',
              direction: 'rtl', marginBottom: 13,
              textShadow: '0 0 30px rgba(243,156,18,0.2)',
            }}>
              ← {word.arabicRoot}
            </div>
          )}
          <Pronunciation text={word.european} arabic={word.arabicRoot} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 13, marginTop: 13 }}>
            <RootBadge rootId={word.rootId} size="md" />
            <ConfidenceBadge level={word.confidence} />
          </div>
          {word.meaning && (
            <p style={{ fontSize: 18, color: '#8b949e', fontStyle: 'italic', maxWidth: 500, margin: '21px auto 0', lineHeight: 1.6 }}>
              &ldquo;{word.meaning}&rdquo;
            </p>
          )}
        </section>

        {/* 2. TRANSFORMATION */}
        {word.rule && (
          <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.1s both' }}>
            <SectionHeader title="Phonetic Transformation" subtitle="How the Arabic root became this European word" align="left" />
            <div style={{
              background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
              borderRadius: 21, padding: '34px', textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, marginBottom: 21, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Amiri', serif", fontSize: 42, color: '#f39c12', direction: 'rtl', marginBottom: 8 }}>{word.arabicRoot}</div>
                  <div style={{ fontSize: 12, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>Arabic</div>
                </div>
                <div style={{ fontSize: 34, color: '#484f58' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 42, color: '#e6edf3', marginBottom: 8 }}>{word.european}</div>
                  <div style={{ fontSize: 12, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>{word.language ? LANGUAGE_DISPLAY[word.language] || word.language : 'European'}</div>
                </div>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 15,
                color: '#22C55E', padding: '13px 21px',
                background: 'rgba(34,197,94,0.08)', borderRadius: 13,
                display: 'inline-block',
              }}>
                {word.rule}
              </div>
            </div>
          </section>
        )}

        {/* 3. ACROSS LANGUAGES */}
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.2s both' }}>
          <SectionHeader title="Across Languages" subtitle="The root through history" align="left" />
          <div style={{
            background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: '21px 34px',
          }}>
            {langsBefore.map((code, i) => (
              <div key={code} style={{
                display: 'flex', alignItems: 'center', gap: 21, padding: '16px 0',
                borderBottom: i < langsBefore.length - 1 ? '1px solid rgba(48,54,61,0.3)' : 'none',
              }}>
                <div style={{
                  width: 80, fontSize: 12, color: '#484f58',
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px', textTransform: 'uppercase',
                }}>
                  {LANGUAGE_DISPLAY[code] || code}
                </div>
                <div style={{
                  fontSize: code === 'AR' ? 24 : 21,
                  fontFamily: code === 'AR' ? "'Amiri', serif" : "'Cinzel Decorative', serif",
                  color: '#e6edf3',
                  direction: code === 'AR' ? 'rtl' : 'ltr',
                }}>
                  {code === 'AR' ? word.arabicRoot || word.european :
                   code === word.language ? word.european :
                   `—`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. THE PHYSICS */}
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.3s both' }}>
          <SectionHeader title="The Physics" subtitle="What this root reveals about reality" align="left" />
          <div style={{
            background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: '34px',
          }}>
            <div style={{ display: 'flex', gap: 21, marginBottom: 21, alignItems: 'center' }}>
              <div style={{
                width: 55, height: 55, borderRadius: '50%',
                background: word.rootId === 'ATUM' ? '#22C55E' : word.rootId === 'BULL' ? '#EF4444' : '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 700, color: '#fff',
                flexShrink: 0,
              }}>
                {word.rootId[0]}
              </div>
              <div>
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 24, color: '#e6edf3' }}>{word.rootId}</div>
                <div style={{ fontSize: 14, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace" }}>{rootInfo?.principle}</div>
              </div>
            </div>
            <p style={{ fontSize: 16, color: '#8b949e', lineHeight: 1.8 }}>
              {rootInfo?.physics}
            </p>
            {concepts.length > 0 && (
              <div style={{ marginTop: 21, display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div style={{ fontSize: 13, color: '#f39c12', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px', textTransform: 'uppercase' }}>
                  From the Sources
                </div>
                {concepts.map(c => (
                  <div key={c.id} style={{
                    padding: '21px', borderRadius: 13,
                    background: 'rgba(243,156,18,0.04)',
                    border: '1px solid rgba(243,156,18,0.15)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 15, color: '#e6edf3', fontWeight: 600 }}>{c.title}</div>
                      <span style={{
                        fontSize: 10, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace",
                        background: 'rgba(48,54,61,0.5)', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase',
                      }}>{c.topic}</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                      {c.content}
                    </p>
                    <div style={{ fontSize: 11, color: '#484f58', marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                      — {c.sourceFile}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. IN YOUR DAILY LIFE */}
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.4s both' }}>
          <SectionHeader title="In Your Daily Life" subtitle="You encounter this root every day" align="left" />
          <div style={{
            background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: '34px',
          }}>
            <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.8, marginBottom: 21 }}>
              The {word.rootId} root pattern appears in dozens of everyday words. Once you recognize it, you will see it everywhere.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 13 }}>
              {(rootInfo?.daily || []).map((example, i) => (
                <div key={i} style={{
                  padding: '16px 21px', borderRadius: 13,
                  background: 'rgba(48,54,61,0.3)',
                  border: '1px solid rgba(48,54,61,0.3)',
                  fontSize: 14, color: '#e6edf3',
                  fontStyle: 'italic',
                }}>
                  {example}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SOURCES */}
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.5s both' }}>
          <SectionHeader title="Sources" subtitle="Primary research backing this etymology" align="left" />
          <div style={{
            background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: '34px',
          }}>
            <div style={{ display: 'flex', gap: 13, marginBottom: 21, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#e6edf3', background: 'rgba(48,54,61,0.5)', padding: '4px 12px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                Confidence: <ConfidenceBadge level={word.confidence} />
              </span>
              <span style={{ fontSize: 13, color: '#e6edf3', background: 'rgba(48,54,61,0.5)', padding: '4px 12px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                Root: {word.rootId}
              </span>
              {word.language && (
                <span style={{ fontSize: 13, color: '#e6edf3', background: 'rgba(48,54,61,0.5)', padding: '4px 12px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                  Language: {LANGUAGE_DISPLAY[word.language] || word.language}
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.7, marginBottom: 13 }}>
              The transformation rule <code style={{ color: '#22C55E', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(34,197,94,0.08)', padding: '2px 6px', borderRadius: 4 }}>{word.rule || 'N/A'}</code> follows the phonetic shift patterns documented across multiple linguistic studies.
            </div>
            <div style={{ fontSize: 12, color: '#484f58' }}>
              Primary sources: Kaggle etymology database, Sacred Word Flow research, Abjad letter DNA analysis
            </div>
          </div>
        </section>

        {/* 7. RELATED WORDS */}
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.6s both' }}>
          <SectionHeader title="Related Words" subtitle={`Other ${word.rootId}-root words`} align="left" />
          {related.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 13 }}>
              {related.map(rw => (
                <div key={rw.id}
                  onClick={() => router.push(`/${locale}/etymology/${encodeURIComponent(rw.european.toLowerCase())}`)}
                  style={{
                    padding: '16px 21px', borderRadius: 13,
                    background: 'rgba(22,27,34,0.6)',
                    border: '1px solid rgba(48,54,61,0.4)',
                    cursor: 'pointer',
                    transition: 'all 233ms ease',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = word.rootId === 'ATUM' ? '#22C55E44' : word.rootId === 'BULL' ? '#EF444444' : '#3B82F644'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(48,54,61,0.4)'}
                >
                  <div>
                    <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 16, color: '#e6edf3' }}>
                      {rw.european}
                    </div>
                    {rw.arabicRoot && (
                      <div style={{ fontFamily: "'Amiri', serif", fontSize: 16, color: '#f39c12', direction: 'rtl', marginTop: 4 }}>
                        {rw.arabicRoot}
                      </div>
                    )}
                  </div>
                  <ConfidenceBadge level={rw.confidence} showLabel={false} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '34px', textAlign: 'center', color: '#484f58', fontSize: 14 }}>
              No other {word.rootId}-root words found in this batch
            </div>
          )}
        </section>

        <div style={{ textAlign: 'center', padding: '21px 0' }}>
          <button onClick={() => router.push(`/${locale}/explorer`)}
            style={{ padding: '10px 34px', borderRadius: 21, border: '1px solid #8b949e', background: 'transparent', color: '#8b949e', cursor: 'pointer', fontSize: 14 }}>
            ← Back to Explorer
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
