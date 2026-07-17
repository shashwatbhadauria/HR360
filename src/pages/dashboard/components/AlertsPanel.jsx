import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import Card from '@/components/shared/ui/Card';
import { formatTimeAgo } from '@/utils/formatters';

const ALERT_ICONS = {
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
  success: <CheckCircle size={16} />,
  danger: <XCircle size={16} />,
};

const ALERT_COLORS = {
  warning: { bg: 'var(--color-warning-soft)', color: 'var(--color-warning)', border: 'var(--color-warning)' },
  info: { bg: 'var(--color-info-soft)', color: 'var(--color-info)', border: 'var(--color-info)' },
  success: { bg: 'var(--color-success-soft)', color: 'var(--color-success)', border: 'var(--color-success)' },
  danger: { bg: 'var(--color-danger-soft)', color: 'var(--color-danger)', border: 'var(--color-danger)' },
};

export default function AlertsPanel({ alerts }) {
  if (!alerts?.length) return null;

  return (
    <Card>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Recent Alerts
        </h3>
        <span 
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--color-brand)',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
        >
          View all &rarr;
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts.slice(0, 5).map((alert, i) => {
          const style = ALERT_COLORS[alert.type] || ALERT_COLORS.info;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: style.bg,
                borderLeft: `3px solid ${style.border}`,
                opacity: alert.read ? 0.6 : 1,
              }}
            >
              <span style={{ color: style.color, marginTop: '1px', flexShrink: 0 }}>
                {ALERT_ICONS[alert.type]}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: alert.read ? 500 : 600,
                  color: 'var(--color-text-primary)', 
                  lineHeight: '20px',
                  marginBottom: '2px',
                }}>
                  {alert.message}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: 'var(--color-text-tertiary, #9CA3AF)', 
                }}>
                  {formatTimeAgo(alert.timestamp)}
                </p>
              </div>
              {!alert.read && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: style.color,
                  marginTop: '6px',
                  flexShrink: 0,
                }} />
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
