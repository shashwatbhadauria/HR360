import { Clock, Users, UserCheck, AlertTriangle, MoreHorizontal } from 'lucide-react';

export default function KpiSummaryRow({ kpis }) {
  if (!kpis) return null;

  const getTrend = (current, previous) => {
    if (!previous || previous === 0) return { trend: 0, isPositive: true };
    const diff = current - previous;
    const percent = (Math.abs(diff) / previous) * 100;
    return { trend: percent.toFixed(1), isPositive: diff >= 0 };
  };

  const cards = [
    {
      title: 'Avg Hours Utilization',
      value: kpis.avgUtilization.value,
      ...getTrend(kpis.avgUtilization.value, kpis.avgUtilization.previous),
      icon: <Clock size={20} color="white" />,
    },
    {
      title: 'Attendance Rate',
      value: kpis.attendanceRate.value,
      ...getTrend(kpis.attendanceRate.value, kpis.attendanceRate.previous),
      icon: <UserCheck size={20} color="white" />,
    },
    {
      title: 'Active Employees',
      value: kpis.activeEmployees.value,
      ...getTrend(kpis.activeEmployees.value, kpis.activeEmployees.previous),
      icon: <Users size={20} color="white" />,
    },
    {
      title: 'Needs Attention',
      value: kpis.flaggedEmployees.value,
      ...getTrend(kpis.flaggedEmployees.value, kpis.flaggedEmployees.previous),
      icon: <AlertTriangle size={20} color="white" />,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#4F46E5', // Indigo/Blue
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                {card.title}
              </h3>
            </div>
            <MoreHorizontal size={20} color="var(--color-text-secondary)" style={{ cursor: 'pointer' }} />
          </div>
          
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
            {Math.round(card.value)}{i === 0 || i === 1 ? '%' : ''}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: card.isPositive ? '#ECFDF5' : '#FEF2F2',
              color: card.isPositive ? '#10B981' : '#EF4444',
              padding: '4px 8px', borderRadius: '12px',
              fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              {card.isPositive ? '↑' : '↓'} {Math.abs(card.trend)}%
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>From Last week</span>
          </div>
        </div>
      ))}
    </div>
  );
}
