'use client';

import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import Footer from '@/components/Footer';

export default function ResearchPage() {
  return (
    <>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title="Research Dashboard" subtitle="The computational linguistics and statistical evidence behind the three root theory." />

        <div style={{ display: 'flex', gap: 13, marginBottom: 13, flexWrap: 'wrap' }}>
          <StatCard value={99.7} label="CNN Accuracy" color="#22C55E" suffix="%" />
          <StatCard value={'<0.0001'} label="p-value" color="#3B82F6" prefix="p" />
          <StatCard value={'0.693'} label="Correlation" color="#EF4444" prefix="r=−" />
          <StatCard value={96} label="Proven" color="#f39c12" />
        </div>
        <div style={{ display: 'flex', gap: 13, marginBottom: 55, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', fontSize: 13, color: '#6e7681', fontStyle: 'italic', lineHeight: 1.7, padding: '0 8px' }}>
            Almost perfect match between Arabic letter sounds and Chladni wave patterns
          </div>
          <div style={{ flex: '1 1 200px', fontSize: 13, color: '#6e7681', fontStyle: 'italic', lineHeight: 1.7, padding: '0 8px' }}>
            Less than 1 in 10,000 chance this is coincidence
          </div>
          <div style={{ flex: '1 1 200px', fontSize: 13, color: '#6e7681', fontStyle: 'italic', lineHeight: 1.7, padding: '0 8px' }}>
            Strong negative correlation: rarer letters have higher Abjad values
          </div>
          <div style={{ flex: '1 1 200px', fontSize: 13, color: '#6e7681', fontStyle: 'italic', lineHeight: 1.7, padding: '0 8px' }}>
            Etymologies with 3+ independent sources
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
