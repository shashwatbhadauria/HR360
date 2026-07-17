/**
 * Status badge — pill shape with semantic color tint + matching text.
 * Used for attendance states, employee status, app categories.
 */
const STATUS_STYLES = {
  present: { bg: 'var(--color-success-soft)', color: 'var(--color-success)', label: 'Present' },
  absent: { bg: 'var(--color-danger-soft)', color: 'var(--color-danger)', label: 'Absent' },
  late: { bg: 'var(--color-warning-soft)', color: 'var(--color-warning)', label: 'Late' },
  half_day: { bg: 'var(--color-warning-soft)', color: 'var(--color-warning)', label: 'Half-day' },
  on_leave: { bg: 'var(--color-neutral-soft)', color: 'var(--color-neutral)', label: 'On Leave' },
  wfh: { bg: 'var(--color-info-soft)', color: 'var(--color-info)', label: 'WFH' },
  active: { bg: 'var(--color-success-soft)', color: 'var(--color-success)', label: 'Active' },
  inactive: { bg: 'var(--color-neutral-soft)', color: 'var(--color-neutral)', label: 'Inactive' },
  productive: { bg: 'var(--color-success-soft)', color: 'var(--color-success)', label: 'Productive' },
  neutral: { bg: 'var(--color-info-soft)', color: 'var(--color-info)', label: 'Neutral' },
  distracting: { bg: 'var(--color-warning-soft)', color: 'var(--color-warning)', label: 'Distracting' },
  success: { bg: 'var(--color-success-soft)', color: 'var(--color-success)', label: '' },
  warning: { bg: 'var(--color-warning-soft)', color: 'var(--color-warning)', label: '' },
  danger: { bg: 'var(--color-danger-soft)', color: 'var(--color-danger)', label: '' },
  info: { bg: 'var(--color-info-soft)', color: 'var(--color-info)', label: '' },
};

export default function StatusBadge({ status, label, size = 'sm', style = {} }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.neutral;
  const displayLabel = label || s.label || status;
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: isSmall ? '2px 10px' : '4px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: isSmall ? '12px' : '13px',
        fontWeight: 500,
        lineHeight: isSmall ? '18px' : '20px',
        background: s.bg,
        color: s.color,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: s.color,
        flexShrink: 0,
      }} />
      {displayLabel}
    </span>
  );
}
