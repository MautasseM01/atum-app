'use client';

import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import Footer from '@/components/Footer';

export default function ResearchPage() {
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
      </div>
      <Footer />
    </>
  );
}
