import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

/**
 * KPI Card — icon + label + big animated counter + trend indicator.
 * Used in the 4-card summary row on the dashboard.
 */
export default function KpiCard({
  icon,
  label,
  value,
  previousValue,
  suffix = '',
  prefix = '',
  trend, // 'up' | 'down' | null — auto-calculated if previousValue given
  trendLabel, // e.g. "vs last week"
  color = 'var(--color-brand)',
  colorSoft = 'var(--color-brand-soft)',
  style = {},
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  // Count-up animation
  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startVal = 0;
    const endVal = numericValue;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startVal + (endVal - startVal) * eased);

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [numericValue]);

  // Auto trend
  const autoTrend = trend || (previousValue != null
    ? numericValue > previousValue ? 'up' : numericValue < previousValue ? 'down' : null
    : null);

  const trendPercent = previousValue && previousValue !== 0
    ? Math.abs(((numericValue - previousValue) / previousValue) * 100).toFixed(1)
    : null;

  return (
    <Card style={{ ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            fontWeight: 500,
            marginBottom: '8px',
          }}>
            {label}
          </div>
          <div style={{
            fontSize: '32px',
            lineHeight: '1.2',
            fontWeight: 800,
            letterSpacing: '-1px',
            color: 'var(--color-text-primary)',
            fontFeatureSettings: '"tnum"',
          }}>
            {prefix}{typeof value === 'number' ? Math.round(displayValue * 10) / 10 : value}{suffix}
          </div>
          {(autoTrend || trendLabel) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '8px',
              fontSize: '12px',
            }}>
              {autoTrend && (
                <span style={{
                  color: autoTrend === 'up' ? 'var(--color-success)' : 'var(--color-danger)',
                  fontWeight: 600,
                }}>
                  {autoTrend === 'up' ? '↑' : '↓'} {trendPercent}%
                </span>
              )}
              {trendLabel && (
                <span style={{ color: 'var(--color-text-secondary)' }}>{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: colorSoft,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </Card>
  );
}
