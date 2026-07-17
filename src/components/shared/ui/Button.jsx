/**
 * Button component with primary, secondary, ghost, and danger variants.
 */
const VARIANTS = {
  primary: {
    background: 'var(--color-brand)',
    color: '#fff',
    border: 'none',
    hoverBg: 'var(--color-brand-hover)',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    hoverBg: 'var(--color-bg)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: 'none',
    hoverBg: 'var(--color-bg)',
  },
  danger: {
    background: 'var(--color-danger)',
    color: '#fff',
    border: 'none',
    hoverBg: '#B91C1C',
  },
};

const SIZES = {
  sm: { height: '32px', padding: '0 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)' },
  md: { height: '38px', padding: '0 16px', fontSize: '14px', borderRadius: 'var(--radius-sm)' },
  lg: { height: '44px', padding: '0 24px', fontSize: '15px', borderRadius: 'var(--radius-md)' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled = false,
  fullWidth = false,
  style = {},
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, transform 0.1s',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        ...s,
        background: v.background,
        color: v.color,
        border: v.border,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = v.hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = v.background;
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(1)';
      }}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: 'flex', alignItems: 'center' }}>{iconRight}</span>}
    </button>
  );
}
