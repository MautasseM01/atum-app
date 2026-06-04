'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/SectionHeader';
import RootBadge from '@/components/RootBadge';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import Pronunciation from '@/components/Pronunciation';
import InsightContent from '@/components/InsightContent';
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

interface Insight {
  word: string; locale: string; content: string; excerpt: string;
  meta: { arabicRoot: string; root: string; confidence: string };
}



export default function WordPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('WordPage');
  const wordSlug = params?.word as string;
  const locale = params?.locale as string || 'en';

  const [word, setWord] = useState<WordData | null>(null);
  const [concepts, setConcepts] = useState<ScoredConcept[]>([]);
  const [related, setRelated] = useState<WordData[]>([]);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [insightSource, setInsightSource] = useState<'file' | 'fallback' | 'none'>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wordSlug) return;
    setLoading(true);
    fetch(`/api/etymology/search?q=${encodeURIComponent(wordSlug)}&limit=50`).then(r => r.json()).then(wordRes => {
      const results = wordRes.results || [];
      const found = results.find((r: WordData) => r.european.toLowerCase() === wordSlug.toLowerCase()) || results[0];
      setWord(found || null);
      if (found) {
        fetch(`/api/etymology/search?root=${found.rootId}&limit=8`).then(r => r.json()).then(relatedRes => {
          const relatedWords = (relatedRes.results || []).filter((r: WordData) => r.european.toLowerCase() !== wordSlug.toLowerCase());
          setRelated(relatedWords.slice(0, 8));
        });
        fetch(`/api/concepts/related?root=${found.rootId}&word=${encodeURIComponent(found.european)}`).then(r => r.json()).then(cr => {
          setConcepts(cr.concepts || []);
        });
        fetch(`/api/word-insight?word=${encodeURIComponent(found.european.toLowerCase())}&locale=${locale}&root=${found.rootId}`).then(r => r.json()).then(ir => {
          if (ir.found) {
            setInsight(ir.insight);
            setInsightSource(ir.source);
          }
        });
      }
    }).finally(() => setLoading(false));
  }, [wordSlug, locale]);

  if (loading) {
    return (
      <div style={{ padding: '120px 34px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 55, marginBottom: 21, opacity: 0.4 }}>⟳</div>
        <div style={{ color: '#484f58', fontSize: 16 }}>{t('loadingEtymology')}</div>
      </div>
    );
  }

  if (!word) {
    return (
      <div style={{ padding: '120px 34px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 55, marginBottom: 21, opacity: 0.4 }}>⌕</div>
        <div style={{ fontSize: 24, color: '#e6edf3', marginBottom: 8, fontFamily: "'Cinzel Decorative', serif" }}>
          {t('wordNotFound')}
        </div>
        <div style={{ color: '#8b949e', marginBottom: 34 }}>
          {t('wordNotFoundBody', { word: wordSlug })}
        </div>
        <button onClick={() => router.push(`/${locale}/explorer`)}
          style={{ padding: '10px 34px', borderRadius: 21, border: '1px solid #f39c12', background: 'transparent', color: '#f39c12', cursor: 'pointer', fontSize: 14 }}>
          {t('backToExplorer')}
        </button>
      </div>
    );
  }

    const rootInfo = {
    principle: t(`roots.${word.rootId}.principle`),
    physics: t(`roots.${word.rootId}.physics`),
    daily: (t.raw(`roots.${word.rootId}.daily`) as string[]) || [],
  };
  const langSteps = ['AR', 'GR', 'LA', 'EN', 'FR'];
  const langsBefore = langSteps.slice(0, langSteps.indexOf(word.language) + 1);
  const langDisplay = (code: string) => t(`languages.${code}`) || code;

  return (
    <>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ padding: '120px 34px 89px', maxWidth: 900, margin: '0 auto' }}>
        {/* BREADCRUMB */}
        <nav dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-label="breadcrumb" style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28,
          fontSize: 13, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace",
          flexWrap: 'wrap',
        }}>
          <span
            onClick={() => router.push(`/${locale}/explorer`)}
            style={{ cursor: 'pointer', color: '#8b949e', transition: 'color 233ms ease' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#f39c12'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#8b949e'}
          >
            {t('breadcrumbExplorer')}
          </span>
          <span style={{ color: '#484f58' }}>{locale === 'ar' ? '‹' : '›'}</span>
          <span
            onClick={() => router.push(`/${locale}/explorer?root=${word.rootId}`)}
            style={{
              cursor: 'pointer',
              color: word.rootId === 'ATUM' ? '#22C55E' : word.rootId === 'BULL' ? '#EF4444' : '#3B82F6',
              transition: 'opacity 233ms ease', fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            {word.rootId}
          </span>
          <span style={{ color: '#484f58' }}>{locale === 'ar' ? '‹' : '›'}</span>
          <span style={{ color: '#e6edf3' }}>{word.european}</span>
        </nav>

        {/* 1. HERO */}
        <section style={{ textAlign: 'center', marginBottom: 55, animation: 'fadeIn 0.6s ease 0ms both' }}>
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

        {/* 1.5 SIMPLIFIED EXPLANATION */}
        {insight && (
          <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.144s both' }}>
            <SectionHeader
              title={t('simplifiedExplanation')}
              subtitle={insightSource === 'file' ? t('simplifiedSubtitleFile') : t('simplifiedSubtitleFallback')}
              align="left"
            />
            <div style={{
              background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
              borderRadius: 21, padding: '34px',
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 10, color: insightSource === 'file' ? '#22C55E' : '#f39c12',
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px',
                  background: insightSource === 'file' ? 'rgba(34,197,94,0.08)' : 'rgba(243,156,18,0.08)',
                  padding: '3px 9px', borderRadius: 4, textTransform: 'uppercase',
                  border: `1px solid ${insightSource === 'file' ? 'rgba(34,197,94,0.2)' : 'rgba(243,156,18,0.2)'}`,
                }}>
                  {insightSource === 'file' ? t('fromSources') : t('autoGenerated')}
                </span>
                {insight.meta.confidence && (
                  <span style={{ fontSize: 11, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace" }}>
                    {insight.meta.confidence}
                  </span>
                )}
              </div>
              <InsightContent content={insight.content} />
            </div>
          </section>
        )}

        {/* 2. TRANSFORMATION */}
        {word.rule && (
          <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.233s both' }}>
            <SectionHeader title={t('phoneticTransformation')} subtitle={t('phoneticSubtitle')} align="left" />
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
                  <div style={{ fontSize: 12, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>{word.language ? langDisplay(word.language) : 'European'}</div>
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
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.377s both' }}>
          <SectionHeader title={t('acrossLanguages')} subtitle={t('acrossLanguagesSubtitle')} align="left" />
          <div style={{
            background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: '28px 34px',
            overflowX: 'auto',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
              minWidth: 'max-content',
            }}>
              {langsBefore.map((code, i) => {
                const isActive = code === word.language;
                const colors: Record<string, string> = { AR: '#f39c12', GR: '#8B5CF6', LA: '#EF4444', EN: '#3B82F6', FR: '#10B981' };
                const color = colors[code] || '#8b949e';
                const wordText = code === 'AR' ? (word.arabicRoot || word.european) : code === word.language ? word.european : '—';
                return (
                  <div key={code} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
                    }}>
                      <div style={{
                        padding: '10px 20px', borderRadius: 21,
                        background: isActive ? `${color}22` : 'rgba(48,54,61,0.3)',
                        border: `2px solid ${isActive ? color : 'rgba(48,54,61,0.4)'}`,
                        color: isActive ? color : '#8b949e',
                        fontFamily: code === 'AR' ? "'Amiri', serif" : "'Cinzel Decorative', serif",
                        fontSize: code === 'AR' ? 20 : 16,
                        direction: code === 'AR' ? 'rtl' : 'ltr',
                        whiteSpace: 'nowrap',
                        boxShadow: isActive ? `0 0 20px ${color}33` : 'none',
                        transition: 'all 233ms ease',
                        minWidth: 80, textAlign: 'center',
                      }}>
                        {wordText}
                      </div>
                      <div style={{
                        fontSize: 10, color: color, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '1px', textTransform: 'uppercase',
                        background: `${color}11`, padding: '2px 8px', borderRadius: 4,
                      }}>
                        {langDisplay(code)}
                      </div>
                    </div>
                    {i < langsBefore.length - 1 && (
                      <div style={{
                        fontSize: 20, color: '#484f58', padding: '0 8px',
                        alignSelf: 'flex-start', marginTop: 14,
                      }}>
                        {locale === 'ar' ? '←' : '→'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. THE PHYSICS */}
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.610s both' }}>
          <SectionHeader title={t('thePhysics')} subtitle={t('physicsSubtitle')} align="left" />
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
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.987s both' }}>
          <SectionHeader title={t('dailyLife')} subtitle={t('dailyLifeSubtitle')} align="left" />
          <div style={{
            background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: '34px',
          }}>
            <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.8, marginBottom: 21 }}>
              {t('dailyLifeBody', { root: word.rootId })}
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
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 1.597s both' }}>
          <SectionHeader title={t('sourcesTitle')} subtitle={t('sourcesSubtitle')} align="left" />
          <div style={{
            background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: '34px',
          }}>
            <div style={{ display: 'flex', gap: 13, marginBottom: 21, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#e6edf3', background: 'rgba(48,54,61,0.5)', padding: '4px 12px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                {t('confidenceLabel')}: <ConfidenceBadge level={word.confidence} />
              </span>
              <span style={{ fontSize: 13, color: '#e6edf3', background: 'rgba(48,54,61,0.5)', padding: '4px 12px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                {t('rootLabel')}: {word.rootId}
              </span>
              {word.language && (
                <span style={{ fontSize: 13, color: '#e6edf3', background: 'rgba(48,54,61,0.5)', padding: '4px 12px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                  {t('languageLabel')}: {langDisplay(word.language)}
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.7, marginBottom: 13 }}>
              {t.rich?.('transformationRuleBody', {
                rule: () => <code style={{ color: '#22C55E', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(34,197,94,0.08)', padding: '2px 6px', borderRadius: 4 }}>{word.rule || 'N/A'}</code>
              }) || t('transformationRuleBody', { rule: word.rule || 'N/A' })}
            </div>
            <div style={{ fontSize: 12, color: '#484f58' }}>
              {t('primarySources')}
            </div>
          </div>
        </section>

        {/* 7. RELATED WORDS */}
        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 2.584s both' }}>
          <SectionHeader title={t('relatedWords')} subtitle={t('relatedWordsSubtitle', { root: word.rootId })} align="left" />
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
              {t('noRelated', { root: word.rootId })}
            </div>
          )}
        </section>

        <div style={{ textAlign: 'center', padding: '21px 0' }}>
          <button onClick={() => router.push(`/${locale}/explorer`)}
            style={{ padding: '10px 34px', borderRadius: 21, border: '1px solid #8b949e', background: 'transparent', color: '#8b949e', cursor: 'pointer', fontSize: 14 }}>
            {t('backToExplorer')}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
