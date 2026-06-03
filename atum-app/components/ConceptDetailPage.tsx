'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/SectionHeader';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import InsightContent from '@/components/InsightContent';
import Footer from '@/components/Footer';
import {
  type IndexConcept,
  type Locale,
  topicLabel,
  pickLocale,
  getRootAccent,
} from '@/lib/concepts';

export default function ConceptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';
  const locale = ((params?.locale as string) || 'en') as Locale;
  const t = useTranslations('Concepts');

  const [concept, setConcept] = useState<IndexConcept | null>(null);
  const [body, setBody] = useState<string>('');
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allConcepts, setAllConcepts] = useState<IndexConcept[]>([]);
  const [notFoundTriggered, setNotFoundTriggered] = useState(false);

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setConcept(null);
    setBody('');
    setFallbackUsed(false);

    fetch('/api/concept-index')
      .then(r => r.json())
      .then(data => {
        const concepts = data?.concepts || [];
        setAllConcepts(concepts);
        const found = concepts.find((c: IndexConcept) => c.id === id);
        if (!found) {
          setNotFoundTriggered(true);
          notFound();
          return;
        }
        setConcept(found);
        return fetch(`/api/concept-content?id=${encodeURIComponent(id)}&locale=${locale}`)
          .then(r => r.json())
          .then(contentData => {
            if (contentData?.content) {
              setBody(contentData.content.body || '');
              if (typeof contentData.content.fallbackUsed === 'boolean') {
                setFallbackUsed(contentData.content.fallbackUsed);
              }
            }
          });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, locale]);

  if (notFoundTriggered) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ padding: '120px 34px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 55, marginBottom: 21, opacity: 0.4 }}>⟳</div>
        <div style={{ color: '#484f58', fontSize: 16 }}>{t('loading')}</div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div style={{ padding: '120px 34px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 55, marginBottom: 21, opacity: 0.4 }}>⌕</div>
        <div style={{ fontSize: 24, color: '#e6edf3', marginBottom: 8, fontFamily: "'Cinzel Decorative', serif" }}>
          {t('notFoundTitle')}
        </div>
        <div style={{ color: '#8b949e', marginBottom: 34 }}>
          {t('notFoundBody', { id })}
        </div>
        <button onClick={() => router.push(`/${locale}/concepts`)}
          style={{ padding: '10px 34px', borderRadius: 21, border: '1px solid #f39c12', background: 'transparent', color: '#f39c12', cursor: 'pointer', fontSize: 14 }}>
          {t('backToConcepts')}
        </button>
      </div>
    );
  }

  const accent = getRootAccent(concept.relatedRoot);
  const title = pickLocale(concept.title, locale);

  const relatedConcepts = allConcepts
    .filter(c => c.id !== concept.id && (c.topic === concept.topic || (c.relatedRoot === concept.relatedRoot && concept.relatedRoot !== 'ALL')))
    .slice(0, 4);

  return (
    <>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ padding: '120px 34px 89px', maxWidth: 900, margin: '0 auto' }}>
        <nav aria-label="breadcrumb" style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28,
          fontSize: 13, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace",
          flexWrap: 'wrap',
        }}>
          <span
            onClick={() => router.push(`/${locale}/concepts`)}
            style={{ cursor: 'pointer', color: '#8b949e', transition: 'color 233ms ease' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#f39c12'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#8b949e'}
          >
            {t('breadcrumb')}
          </span>
          <span style={{ color: '#484f58' }}>{locale === 'ar' ? '‹' : '›'}</span>
          <span style={{ color: '#e6edf3' }}>{title}</span>
        </nav>

        <section style={{
          marginBottom: 42, animation: 'fadeIn 0.6s ease',
          position: 'relative',
          padding: '34px 34px 28px',
          borderRadius: 21,
          background: 'rgba(22, 27, 34, 0.6)',
          border: '1px solid rgba(48, 54, 61, 0.4)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: `linear-gradient(90deg, ${accent}aa, ${accent}33)`,
          }} />
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, color: accent, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '1px', textTransform: 'uppercase',
              background: `${accent}11`, padding: '3px 9px', borderRadius: 4,
              border: `1px solid ${accent}33`,
            }}>
              {topicLabel(concept.topic, locale)}
            </span>
            {fallbackUsed && (
              <span style={{
                fontSize: 10, color: '#f39c12', fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '1px', textTransform: 'uppercase',
                background: 'rgba(243,156,18,0.08)', padding: '3px 9px', borderRadius: 4,
                border: '1px solid rgba(243,156,18,0.2)',
              }}>
                {t('fallbackBadge')}
              </span>
            )}
          </div>
          <h1 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(28px, 5vw, 42px)',
            color: '#e6edf3', lineHeight: 1.2, marginBottom: 16, letterSpacing: '1px',
          }}>
            {title}
          </h1>
          <div style={{ display: 'flex', gap: 13, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8b949e' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
              {concept.relatedRoot === 'ALL' ? 'ATUM · BULL · TOR' : concept.relatedRoot}
            </span>
            <ConfidenceBadge level={concept.confidence} />
          </div>
        </section>

        <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.1s both' }}>
          {body ? (
            <div style={{
              padding: '34px', borderRadius: 21,
              background: 'rgba(22, 27, 34, 0.5)',
              border: '1px solid rgba(48, 54, 61, 0.3)',
            }}>
              <InsightContent content={body} />
            </div>
          ) : (
            <div style={{ padding: '34px', textAlign: 'center', color: '#484f58' }}>
              {t('emptyContent')}
            </div>
          )}
        </section>

        {concept.relatedWords && concept.relatedWords.length > 0 && (
          <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.2s both' }}>
            <SectionHeader title={t('relatedWords')} subtitle={t('relatedWordsSubtitle')} align="left" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 13 }}>
              {concept.relatedWords.map(w => (
                <div
                  key={w}
                  onClick={() => router.push(`/${locale}/etymology/${encodeURIComponent(w)}`)}
                  style={{
                    padding: '16px 21px', borderRadius: 13,
                    background: 'rgba(22,27,34,0.6)',
                    border: '1px solid rgba(48,54,61,0.4)',
                    cursor: 'pointer',
                    transition: 'all 233ms ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: 16, color: '#e6edf3',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = `${accent}66`}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(48,54,61,0.4)'}
                >
                  <span>{w}</span>
                  <span style={{ color: accent, fontSize: 14 }}>→</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedConcepts.length > 0 && (
          <section style={{ marginBottom: 55, animation: 'fadeIn 0.6s ease 0.3s both' }}>
            <SectionHeader title={t('relatedConcepts')} subtitle={t('relatedConceptsSubtitle')} align="left" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 13 }}>
              {relatedConcepts.map(rc => {
                const rcAccent = getRootAccent(rc.relatedRoot);
                const rcTitle = pickLocale(rc.title, locale);
                return (
                  <div
                    key={rc.id}
                    onClick={() => router.push(`/${locale}/concepts/${rc.id}`)}
                    style={{
                      position: 'relative', padding: '16px 21px', borderRadius: 13,
                      background: 'rgba(22,27,34,0.6)',
                      border: '1px solid rgba(48,54,61,0.4)',
                      cursor: 'pointer',
                      transition: 'all 233ms ease',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = `${rcAccent}66`}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(48,54,61,0.4)'}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
                      background: rcAccent,
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: 15, color: '#e6edf3',
                      }}>
                        {rcTitle}
                      </span>
                      <span style={{ color: rcAccent, fontSize: 13 }}>→</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>
                      {topicLabel(rc.topic, locale)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div style={{ textAlign: 'center', padding: '21px 0' }}>
          <button
            onClick={() => router.push(`/${locale}/concepts`)}
            style={{
              padding: '10px 34px', borderRadius: 21,
              border: '1px solid #8b949e', background: 'transparent',
              color: '#8b949e', cursor: 'pointer', fontSize: 14,
            }}
          >
            {t('backToConcepts')}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
