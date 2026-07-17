/**
 * Custom Recharts tooltip — matches design tokens.
 */
export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-dropdown)',
      fontSize: '13px',
      fontFamily: 'var(--font-sans)',
    }}>
      {label && (
        <div style={{
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: '6px',
          fontSize: '13px',
        }}>
          {label}
        </div>
      )}
      {payload.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '2px 0',
          }}
        >
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '2px',
            background: item.color,
            flexShrink: 0,
          }} />
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
            {item.name}:
          </span>
          <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '12px' }}>
            {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            {item.unit || ''}
          </span>
        </div>
      ))}
    </div>
  );
}
