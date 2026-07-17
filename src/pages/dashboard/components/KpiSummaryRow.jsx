import { Clock, Users, UserCheck, AlertTriangle } from 'lucide-react';
import KpiCard from '@/components/shared/ui/KpiCard';

/**
 * 4 KPI summary cards row — Dashboard landing page hero section.
 */
export default function KpiSummaryRow({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      label: 'Avg Hours Utilization',
      value: kpis.avgUtilization.value,
      previousValue: kpis.avgUtilization.previous,
      suffix: '%',
      trendLabel: 'vs last week',
      icon: <Clock size={22} />,
      color: 'var(--color-brand)',
      colorSoft: 'var(--color-brand-soft)',
    },
    {
      label: 'Attendance Rate',
      value: kpis.attendanceRate.value,
      previousValue: kpis.attendanceRate.previous,
      suffix: '%',
      trendLabel: 'vs last week',
      icon: <UserCheck size={22} />,
      color: 'var(--color-success)',
      colorSoft: 'var(--color-success-soft)',
    },
    {
      label: 'Active Employees',
      value: kpis.activeEmployees.value,
      previousValue: kpis.activeEmployees.previous,
      suffix: '',
      trendLabel: 'vs last week',
      icon: <Users size={22} />,
      color: 'var(--color-info)',
      colorSoft: 'var(--color-info-soft)',
    },
    {
      label: 'Needs Attention',
      value: kpis.flaggedEmployees.value,
      previousValue: kpis.flaggedEmployees.previous,
      suffix: '',
      trendLabel: 'vs last week',
      icon: <AlertTriangle size={22} />,
      color: 'var(--color-warning)',
      colorSoft: 'var(--color-warning-soft)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '16px',
    }}>
      {cards.map((card, i) => (
        <KpiCard key={i} {...card} />
      ))}
    </div>
  );
}
