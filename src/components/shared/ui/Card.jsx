/**
 * Reusable Card component — the primary container for all dashboard content.
 * rounded-2xl (16px), shadow-sm, surface background.
 */
export default function Card({ children, padding = '24px', style = {}, className = '', onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-dropdown)';
        e.currentTarget.style.borderColor = 'var(--color-brand)';
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
