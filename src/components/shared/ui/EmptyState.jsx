import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * Empty state — icon + message + optional action.
 * Used when data views have no results. Never a blank white box.
 */
export default function EmptyState({
  icon,
  title = 'No data found',
  description,
  actionLabel,
  onAction,
  style = {},
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        ...style,
      }}
    >
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-secondary)',
        marginBottom: '16px',
      }}>
        {icon || <Inbox size={28} />}
      </div>
      <div style={{
        fontSize: '16px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: '4px',
      }}>
        {title}
      </div>
      {description && (
        <div style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          maxWidth: '320px',
          lineHeight: '20px',
        }}>
          {description}
        </div>
      )}
      {actionLabel && onAction && (
        <div style={{ marginTop: '20px' }}>
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
