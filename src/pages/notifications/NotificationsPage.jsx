import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Check } from 'lucide-react';
import PageContainer from '@/components/shared/layout/PageContainer';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/ui/Button';
import { formatTimeAgo } from '@/utils/formatters';

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'danger', title: 'Critical: Inactive Employee', message: 'Andre Jackson has been inactive for 5+ working days. Consider reaching out.', timestamp: '2026-07-15T08:00:00Z', read: false },
  { id: 'n2', type: 'warning', title: 'Low Utilization Alert', message: '3 employees are below 60% utilization for 3+ consecutive days: Tyler Brooks, Isabella Scott, Hannah Lee.', timestamp: '2026-07-15T07:30:00Z', read: false },
  { id: 'n3', type: 'info', title: 'Weekly Report Ready', message: 'The Engineering team weekly productivity report has been generated and is ready for download.', timestamp: '2026-07-14T17:00:00Z', read: false },
  { id: 'n4', type: 'success', title: 'Top Performer', message: 'Raj Kapoor achieved 100% utilization for 4 consecutive weeks. Consider recognition.', timestamp: '2026-07-14T12:00:00Z', read: true },
  { id: 'n5', type: 'warning', title: 'Attendance Alert', message: '5 employees logged under 70% hours this week. Review the attendance page for details.', timestamp: '2026-07-13T16:00:00Z', read: true },
  { id: 'n6', type: 'info', title: 'New Employee Added', message: 'Hannah Lee has been added to the Human Resources department. Screentime tracking will begin tomorrow.', timestamp: '2026-07-12T10:00:00Z', read: true },
  { id: 'n7', type: 'success', title: 'Monthly Target Met', message: 'Engineering department has exceeded the 85% utilization target for June with 88.5% average.', timestamp: '2026-07-11T09:00:00Z', read: true },
];

const TYPE_STYLES = {
  warning: { icon: <AlertTriangle size={18} />, bg: 'var(--color-warning-soft)', color: 'var(--color-warning)' },
  info: { icon: <Info size={18} />, bg: 'var(--color-info-soft)', color: 'var(--color-info)' },
  success: { icon: <CheckCircle size={18} />, bg: 'var(--color-success-soft)', color: 'var(--color-success)' },
  danger: { icon: <XCircle size={18} />, bg: 'var(--color-danger-soft)', color: 'var(--color-danger)' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
          </div>
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" icon={<Check size={14} />} onClick={markAllRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((n, i) => {
            const s = TYPE_STYLES[n.type] || TYPE_STYLES.info;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  padding="16px 20px"
                  style={{
                    opacity: n.read ? 0.65 : 1,
                    borderLeft: `4px solid ${s.color}`,
                    cursor: n.read ? 'default' : 'pointer',
                  }}
                  onClick={!n.read ? () => markRead(n.id) : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
                      background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: s.color, flexShrink: 0,
                    }}>
                      {s.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {n.title}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                          {formatTimeAgo(n.timestamp)}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '20px', marginTop: '4px' }}>
                        {n.message}
                      </p>
                    </div>
                    {!n.read && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: s.color, flexShrink: 0, marginTop: '6px',
                      }} />
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
