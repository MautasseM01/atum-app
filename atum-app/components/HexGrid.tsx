export default function HexGrid({ opacity = 0.03 }) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52'>
    <polygon points='30,0 60,15 60,37 30,52 0,37 0,15' fill='none' stroke='rgba(139,148,158,${opacity})' stroke-width='0.5'/>
  </svg>`;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: '60px 52px',
      }}
    />
  );
}
