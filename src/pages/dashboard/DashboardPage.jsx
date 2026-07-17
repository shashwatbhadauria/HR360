import PageContainer from '@/components/shared/layout/PageContainer';
import { SkeletonDashboard } from '@/components/shared/ui/Skeleton';
import EmptyState from '@/components/shared/ui/EmptyState';
import KpiSummaryRow from './components/KpiSummaryRow';
import HoursTrendChart from './components/HoursTrendChart';
import DepartmentBarChart from './components/DepartmentBarChart';
import AppCategoryDonut from './components/AppCategoryDonut';
import AlertsPanel from './components/AlertsPanel';
import useDashboardData from './hooks/useDashboardData';

/**
 * Dashboard page — the landing page.
 * Assembles: KPI row + trend chart + department bar + donut + alerts.
 */
export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonDashboard />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          title="Failed to load dashboard"
          description={error}
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <EmptyState title="No data available" description="Dashboard data will appear once employee screentime data is synced." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* KPI Cards */}
        <KpiSummaryRow kpis={data.kpis} />

        {/* Charts row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '16px',
        }}>
          <HoursTrendChart data={data.hoursTrend} />
          <DepartmentBarChart data={data.departmentComparison} />
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '16px',
        }}>
          <AppCategoryDonut data={data.appCategorySplit} />
          <AlertsPanel alerts={data.alerts} />
        </div>
      </div>
    </PageContainer>
  );
}
