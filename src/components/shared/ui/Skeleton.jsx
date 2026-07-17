/**
 * Skeleton shimmer loader — matches shape of real content.
 * Per design-strategy: skeleton shimmer, not generic spinner, for above-the-fold content.
 */

export function SkeletonBlock({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--color-bg) 25%, var(--color-border) 50%, var(--color-bg) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function SkeletonText({ lines = 3, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height="14px"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ height = '160px', style = {} }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      padding: '24px',
      ...style,
    }}>
      <SkeletonBlock width="40%" height="14px" style={{ marginBottom: '16px' }} />
      <SkeletonBlock width="60%" height="28px" style={{ marginBottom: '12px' }} />
      <SkeletonBlock width="30%" height="12px" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, style = {} }) {
  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        gap: '16px',
        padding: '12px 16px',
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} width={i === 0 ? '30%' : `${70 / (cols - 1)}%`} height="12px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '16px',
            padding: '14px 16px',
            borderBottom: i < rows - 1 ? '1px solid var(--color-border)' : 'none',
          }}
        >
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBlock key={j} width={j === 0 ? '30%' : `${70 / (cols - 1)}%`} height="14px" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Page-level skeleton for dashboard — 4 KPI cards + chart areas.
 */
export function SkeletonDashboard() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <SkeletonBlock height="300px" borderRadius="var(--radius-lg)" />
        <SkeletonBlock height="300px" borderRadius="var(--radius-lg)" />
      </div>
    </div>
  );
}

// Global shimmer keyframe — inject once
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-shimmer';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;
    document.head.appendChild(style);
  }
}
