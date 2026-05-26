interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

export default function SectionHeader({ title, subtitle, align = 'center' }: SectionHeaderProps) {
  return (
    <div style={{ textAlign: align, marginBottom: 55 }}>
      <h2 style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 34, color: '#e6edf3',
        marginBottom: subtitle ? 13 : 0,
        letterSpacing: '2px',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: 16, color: '#8b949e',
          maxWidth: 610, margin: align === 'center' ? '0 auto' : '0',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
