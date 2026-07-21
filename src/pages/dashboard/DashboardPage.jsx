import { useEffect, useState } from 'react';
import PageContainer from '@/components/shared/layout/PageContainer';
import KpiSummaryRow from './components/KpiSummaryRow';
import AppCategoryDonut from './components/AppCategoryDonut';
import HoursTrendChart from './components/HoursTrendChart';
import DepartmentBarChart from './components/DepartmentBarChart';

const DUMMY_DATA = {
  kpis: {
    avgUtilization: { value: 38.5, previous: 35.2 },
    attendanceRate: { value: 92, previous: 89 },
    activeEmployees: { value: 145, previous: 140 },
    flaggedEmployees: { value: 12, previous: 15 }
  },
  appCategorySplit: [
    { category: 'Productivity', value: 4500 },
    { category: 'Communication', value: 2000 },
    { category: 'Development', value: 1330 }
  ],
  hoursTrend: [
    { displayDay: 'Mon', hours: 6.5 },
    { displayDay: 'Tue', hours: 7.2 },
    { displayDay: 'Wed', hours: 7.8 },
    { displayDay: 'Thu', hours: 8.4 },
    { displayDay: 'Fri', hours: 6.9 },
    { displayDay: 'Sat', hours: 1.2 },
    { displayDay: 'Sun', hours: 0.5 }
  ],
  departmentComparison: [
    { department: 'Engineering', utilization: 85 },
    { department: 'Sales', utilization: 65 },
    { department: 'Marketing', utilization: 70 },
    { department: 'HR', utilization: 90 }
  ]
};

export default function DashboardPage() {
  const data = DUMMY_DATA;
  const loading = false;
  const error = null;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (error) {
    return (
      <PageContainer>
        <div style={{ color: 'var(--color-danger)', padding: '20px' }}>
          Error loading dashboard data: {error.message}
        </div>
      </PageContainer>
    );
  }

  if (!mounted || loading) {
    return (
      <PageContainer>
        <div style={{ padding: '20px', color: 'var(--color-text-secondary)' }}>
          Loading dashboard metrics...
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Floating Header Card */}
          <div style={{ 
            background: '#FFFFFF', 
            padding: '24px 32px', 
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>⊞</span> / HR 360 Dashboard
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px', marginTop: 0 }}>Welcome back,</h2>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, letterSpacing: '-0.5px' }}>Admin</h1>
          </div>

        {/* Grid Layout matching reference UI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Row: KPIs and Donut Chart */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            <div style={{ flex: '2', minWidth: '60%' }}>
              <KpiSummaryRow kpis={data.kpis} />
            </div>
            <div style={{ flex: '1', minWidth: '30%' }}>
              <AppCategoryDonut data={data.appCategorySplit} />
            </div>
          </div>

          {/* Bottom Row: Charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            <div style={{ flex: '2', minWidth: '60%' }}>
              <HoursTrendChart data={data.hoursTrend} />
            </div>
            <div style={{ flex: '1', minWidth: '30%' }}>
              <DepartmentBarChart data={data.departmentComparison} />
            </div>
          </div>
          
        </div>
        </div>
      </PageContainer>
    </>
  );
}
