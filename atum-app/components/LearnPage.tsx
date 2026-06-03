'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';
import {
  type IndexConcept,
  type Locale,
  topicLabel,
  pickLocale,
  getRootAccent,
} from '@/lib/concepts';

interface LearnPageProps {
  sequence: Array<{
    concept: IndexConcept;
    body: string;
  }>;
}


const STEP_INTRO: Record<Locale, string> = {
  en: 'A guided tour through the foundation ideas. Each section is a complete concept. Take your time.',
  ar: 'جولة موجهة عبر الأفكار التأسيسية. كل قسم مفهوم كامل. خذ وقتك.',
  fr: 'Une visite guidée à travers les idées fondatrices. Chaque section est un concept complet. Prenez votre temps.',
};

export default function LearnPage({ sequence }: LearnPageProps) {
  const router = useRouter();
  const params = useParams();
  const locale = ((params?.locale as string) || 'en') as Locale;
  const t = useTranslations('Learn');
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      const sections = document.querySelectorAll('[data-learn-step]');
      let current = 0;
      sections.forEach((s, i) => {
        const rect = (s as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) current = i;
      });
      setActiveIdx(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
      <div style={{ minHeight: '100vh' }}>
        {/* INTRO */}
        <section style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '80px 34px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 720, animation: 'fadeUp 0.8s ease' }}>
            <div style={{
              fontSize: 13, color: '#f39c12', fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 21,
            }}>
              ◈ {t('badge')}
            </div>
            <h1 style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(36px, 7vw, 64px)', color: '#e6edf3',
              lineHeight: 1.1, letterSpacing: '1px', marginBottom: 21,
            }}>
              {t('title')}
            </h1>
            <p style={{ fontSize: 18, color: '#8b949e', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 34px' }}>
              {STEP_INTRO[locale]}
            </p>
            <div style={{ fontSize: 14, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>
              {sequence.length} {t('steps')} · {t('scrollHint')}
            </div>
            <div style={{ marginTop: 21, fontSize: 28, color: '#f39c12', animation: 'pulse 2s infinite' }}>↓</div>
          </div>
        </section>

        {/* PROGRESS DOTS */}
        <div style={{
          position: 'fixed', right: 21, top: '50%', transform: 'translateY(-50%)',
          zIndex: 50, display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {sequence.map((s, i) => {
            const accent = getRootAccent(s.concept.relatedRoot);
            const active = i === activeIdx;
            return (
              <div
                key={s.concept.id}
                onClick={() => {
                  const el = document.querySelector(`[data-learn-step="${i}"]`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                title={pickLocale(s.concept.title, locale)}
                style={{
                  width: 11, height: 11, borderRadius: '50%',
                  background: active ? accent : 'rgba(48,54,61,0.6)',
                  border: active ? `2px solid ${accent}` : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 233ms ease',
                  boxShadow: active ? `0 0 12px ${accent}88` : 'none',
                }}
              />
            );
          })}
        </div>

        {/* STEPS */}
        {sequence.map((step, i) => {
          const accent = getRootAccent(step.concept.relatedRoot);
          const title = pickLocale(step.concept.title, locale);
          const num = String(i + 1).padStart(2, '0');
          return (
            <section
              key={step.concept.id}
              data-learn-step={i}
              style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '80px 34px',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', top: '50%', left: 34, transform: 'translateY(-50%)',
                fontSize: 110, fontFamily: "'Cinzel Decorative', serif", color: `${accent}22`,
                fontWeight: 900, lineHeight: 1, userSelect: 'none',
              }}>
                {num}
              </div>
              <div style={{
                maxWidth: 800, position: 'relative', zIndex: 1,
                padding: '42px 34px',
                borderRadius: 21,
                background: 'rgba(22, 27, 34, 0.6)',
                border: '1px solid rgba(48, 54, 61, 0.4)',
                borderLeft: `4px solid ${accent}`,
                width: '100%',
                boxShadow: `0 0 60px ${accent}11`,
              }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, color: accent, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '1px', textTransform: 'uppercase',
                    background: `${accent}11`, padding: '3px 9px', borderRadius: 4,
                    border: `1px solid ${accent}33`,
                  }}>
                    {topicLabel(step.concept.topic, locale)}
                  </span>
                  <span style={{
                    fontSize: 10, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace",
                    background: 'rgba(48,54,61,0.4)', padding: '3px 8px', borderRadius: 4,
                  }}>
                    {t('stepOf', { current: i + 1, total: sequence.length })}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: 'clamp(24px, 4.5vw, 38px)', color: '#e6edf3',
                  lineHeight: 1.2, marginBottom: 21, letterSpacing: '0.5px',
                }}>
                  {title}
                </h2>
                <div
                  style={{ fontSize: 16, lineHeight: 1.85, color: '#8b949e' }}
                  dangerouslySetInnerHTML={{ __html: renderInlineMd(step.body) }}
                />
                <div style={{ marginTop: 21, display: 'flex', gap: 13, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => router.push(`/${locale}/concepts/${step.concept.id}`)}
                    style={{
                      padding: '8px 18px', borderRadius: 18, cursor: 'pointer',
                      background: `${accent}11`, border: `1px solid ${accent}44`,
                      color: accent, fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('openFull')}
                  </button>
                  {i < sequence.length - 1 ? (
                    <button
                      onClick={() => {
                        const el = document.querySelector(`[data-learn-step="${i + 1}"]`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      style={{
                        padding: '8px 18px', borderRadius: 18, cursor: 'pointer',
                        background: 'transparent', border: '1px solid rgba(48,54,61,0.5)',
                        color: '#8b949e', fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.5px',
                      }}
                    >
                      {t('nextStep')} ↓
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/${locale}/explorer`)}
                      style={{
                        padding: '8px 18px', borderRadius: 18, cursor: 'pointer',
                        background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.4)',
                        color: '#f39c12', fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.5px', fontWeight: 600,
                      }}
                    >
                      {t('exploreNow')} →
                    </button>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* END CTA */}
        <section style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '80px 34px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 42, color: '#e6edf3', marginBottom: 21,
            }}>
              {t('readyTitle')}
            </div>
            <p style={{ fontSize: 17, color: '#8b949e', lineHeight: 1.7, marginBottom: 34 }}>
              {t('readyBody')}
            </p>
            <div style={{ display: 'flex', gap: 13, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push(`/${locale}/explorer`)}
                style={{
                  padding: '14px 28px', borderRadius: 24, cursor: 'pointer',
                  background: 'linear-gradient(135deg, #22C55E22, #3B82F622)',
                  border: '1px solid rgba(243,156,18,0.4)',
                  color: '#f39c12', fontSize: 16, fontWeight: 600,
                  fontFamily: "'Cinzel Decorative', serif", letterSpacing: '1px',
                }}
              >
                {t('explorerCTA')}
              </button>
              <button
                onClick={() => router.push(`/${locale}/patterns`)}
                style={{
                  padding: '14px 28px', borderRadius: 24, cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid rgba(48,54,61,0.5)',
                  color: '#8b949e', fontSize: 16, fontWeight: 600,
                  fontFamily: "'Cinzel Decorative', serif", letterSpacing: '1px',
                }}
              >
                {t('patternsCTA')}
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function renderInlineMd(md: string): string {
  let out = md
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/^#+\s+[^\n]*\n+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*]\s+.*$/gm, '')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  out = out
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e6edf3">$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em style="color:#f39c12">$1</em>')
    .replace(/`([^`]+)`/g, '<code style="font-family:\'JetBrains Mono\', monospace; background:rgba(48,54,61,0.5); padding:2px 6px; border-radius:4px; font-size:0.9em;">$1</code>');
  return `<p>${out}</p>`;
}
