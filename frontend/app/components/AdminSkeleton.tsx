'use client';

const pulse: React.CSSProperties = {
  background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s infinite',
  borderRadius: 8,
};

export default function AdminSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Hero skeleton */}
      <div style={{ ...pulse, height: 88, marginBottom: '1.5rem', borderRadius: 10 }} />

      {/* KPI skeletons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ ...pulse, height: 40, width: '60%', margin: '0 auto .75rem' }} />
            <div style={{ ...pulse, height: 14, width: '80%', margin: '0 auto' }} />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ ...pulse, height: 20, width: 180, marginBottom: '1.25rem' }} />
        <div style={{ ...pulse, height: 280 }} />
      </div>

      {/* Two chart skeletons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '1.5rem' }}>
        {[1, 2].map(i => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.5rem' }}>
            <div style={{ ...pulse, height: 18, width: 200, marginBottom: '1.25rem' }} />
            <div style={{ ...pulse, height: 300 }} />
          </div>
        ))}
      </div>
    </>
  );
}
