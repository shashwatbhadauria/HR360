/**
 * Avatar — photo or initials-based with deterministic color.
 * Per design-strategy: if no photo, use initials with a deterministic color.
 */

const AVATAR_COLORS = [
  '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
  '#EA580C', '#D97706', '#16A34A', '#0891B2',
  '#2563EB', '#4338CA', '#9333EA', '#C026D3',
];

function getColorForName(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Avatar({ name, src, size = 36, style = {} }) {
  const initials = getInitials(name);
  const bgColor = getColorForName(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: 'var(--radius-full)',
          objectFit: 'cover',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-full)',
        background: bgColor,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.max(11, size * 0.36)}px`,
        fontWeight: 600,
        flexShrink: 0,
        letterSpacing: '-0.3px',
        ...style,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}
