import IbdalNetworkGraph from '@/components/IbdalNetworkGraph';
import Footer from '@/components/Footer';
import ibdalData from '@/data/ibdalRules.json';

export default function IbdalVisualizationPage() {
  const rules = (ibdalData as { rules: { makhrajDistance: string }[] }).rules;
  const total = rules.length;
  const closeCount = rules.filter(r => r.makhrajDistance === 'قريب').length;
  const pct = ((closeCount / total) * 100).toFixed(1);

  return (
    <>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 34 }}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 28, color: '#e6edf3', letterSpacing: '2px', marginBottom: 8 }}>
            Ibḍāl Network Graph
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: '#8b949e', marginBottom: 21 }}>
            الإبدال — 75 Phonetic Substitution Rules (Al-Qubaysi)
          </div>
        </div>

        <IbdalNetworkGraph />

        <div style={{
          marginTop: 34, padding: 21, borderRadius: 13,
          background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)',
        }}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 16, color: '#e6edf3', marginBottom: 13 }}>
            What this shows
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#8b949e', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 13px' }}>
              ~{pct}% of documented ibḍāl substitutions occur between letters sharing or
              directly neighboring an articulation point (makhraj). This is consistent
              with the well-known linguistic principle that sound changes tend to move
              along the vocal tract rather than jumping between distant places of articulation.
            </p>
            <p style={{ margin: '0 0 13px' }}>
              <strong>This is a descriptive pattern, not a p-tested discovery.</strong>
              The ibḍāl rules were documented by Arab philologists (Al-Qubaysi, Sibawayh)
              based on centuries of dialect observation. The articulatory explanation is the
              most parsimonious account of why substitutions cluster between adjacent makhraj groups.
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: 'rgba(34,197,94,0.7)' }}>●</span> Green edges = close distance (same/neighboring makhraj) ·{' '}
              <span style={{ color: 'rgba(250,204,21,0.6)' }}>●</span> Yellow = medium ·{' '}
              <span style={{ color: 'rgba(239,68,68,0.5)' }}>●</span> Red = far ·{' '}
              Nodes colored by primary articulation point. Hover any edge for rule details.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 21, padding: 21, borderRadius: 13,
          background: 'rgba(22,27,34,0.4)', border: '1px solid rgba(48,54,61,0.3)',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#484f58' }}>
            Makhraj groups: Pharyngeal/Glottal · Palatal · Velar/Uvular · Labial · Dental/Interdental · General
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
