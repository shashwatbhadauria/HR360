import { motion } from 'framer-motion';
import { getUtilizationStatus } from '@/utils/formatters';

/**
 * Animated progress bar with semantic color based on percentage.
 * Animates fill on mount only (per design strategy motion rules).
 */

const STATUS_COLORS = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  brand: 'var(--color-brand)',
  info: 'var(--color-info)',
};

const STATUS_BG = {
  success: 'var(--color-success-soft)',
  warning: 'var(--color-warning-soft)',
  danger: 'var(--color-danger-soft)',
  brand: 'var(--color-brand-soft)',
  info: 'var(--color-info-soft)',
};

export default function ProgressBar({
  value = 0,
  max = 100,
  status, // override auto-status
  height = 8,
  showLabel = false,
  label,
  animated = true,
  style = {},
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const autoStatus = status || getUtilizationStatus(percent);
  const barColor = STATUS_COLORS[autoStatus] || STATUS_COLORS.brand;
  const bgColor = STATUS_BG[autoStatus] || STATUS_BG.brand;

  return (
    <div style={style}>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
        }}>
          {label && (
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{label}</span>
          )}
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {percent.toFixed(0)}%
          </span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          borderRadius: 'var(--radius-full)',
          background: bgColor,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percent}%` }}
          transition={animated ? { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 } : { duration: 0 }}
          style={{
            height: '100%',
            borderRadius: 'var(--radius-full)',
            background: barColor,
          }}
        />
      </div>
    </div>
  );
}
