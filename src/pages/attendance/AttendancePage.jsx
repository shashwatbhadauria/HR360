import { useState } from 'react';
import PageContainer from '@/components/shared/layout/PageContainer';
import Card from '@/components/shared/ui/Card';
import KpiCard from '@/components/shared/ui/KpiCard';
import DataTable from '@/components/shared/ui/DataTable';
import StatusBadge from '@/components/shared/ui/StatusBadge';
import Avatar from '@/components/shared/ui/Avatar';
import EmptyState from '@/components/shared/ui/EmptyState';
import { SkeletonDashboard } from '@/components/shared/ui/Skeleton';
import Button from '@/components/shared/ui/Button';
import { CalendarCheck, UserX, UserCheck, Clock, Home } from 'lucide-react';
import { DEPARTMENTS } from '@/utils/constants';
import useAttendanceData from './hooks/useAttendanceData';

const ATTENDANCE_COLUMNS = [
  {
    key: 'employeeName',
    label: 'Employee',
    render: (val) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Avatar name={val} size={32} />
        <span style={{ fontWeight: 500 }}>{val}</span>
      </div>
    ),
  },
  { key: 'department', label: 'Department' },
  { key: 'date', label: 'Date', nowrap: true },
  {
    key: 'status',
    label: 'Status',
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'checkIn',
    label: 'Check In',
    render: (val) => val || '—',
  },
  {
    key: 'checkOut',
    label: 'Check Out',
    render: (val) => val || '—',
  },
];

const CustomAttendanceIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="7" x2="11" y2="7" />
    <line x1="3" y1="17" x2="11" y2="17" />
    <path d="M15 4 l6 6" />
    <path d="M21 4 l-6 6" />
    <path d="M14 17 l3 3 l5 -7" />
  </svg>
);

export default function AttendancePage() {
  const { records, summary, isLoading, error, filters, setFilters } = useAttendanceData();
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  if (isLoading) return <PageContainer><SkeletonDashboard /></PageContainer>;
  if (error) return <PageContainer><EmptyState title="Failed to load attendance" description={error} /></PageContainer>;

  const handleFilter = () => {
    setFilters({ department: department || undefined, status: status || undefined });
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI cards */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <KpiCard
              label="Attendance Rate"
              value={summary.attendanceRate}
              suffix="%"
              icon={<CustomAttendanceIcon size={24} color="#8B5CF6" />}
              color="#8B5CF6"
              colorSoft="#F5F3FF"
            />
            <KpiCard
              label="Present Today"
              value={summary.presentToday}
              icon={<UserCheck size={24} strokeWidth={2.5} color="#10B981" />}
              color="var(--color-brand)"
              colorSoft="var(--color-brand-soft)"
            />
            <KpiCard
              label="Absent Today"
              value={summary.absentToday}
              icon={<UserX size={24} strokeWidth={2.5} color="#EF4444" />}
              color="var(--color-danger)"
              colorSoft="var(--color-danger-soft)"
            />
            <KpiCard
              label="Late Today"
              value={summary.lateToday}
              icon={<Clock size={22} />}
              color="var(--color-warning)"
              colorSoft="var(--color-warning-soft)"
            />
          </div>
        )}

        {/* Filters */}
        <Card padding="16px">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-text-primary)',
              }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-text-primary)',
              }}
            >
              <option value="">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="wfh">WFH</option>
              <option value="on_leave">On Leave</option>
              <option value="half_day">Half-day</option>
            </select>
            <Button size="sm" onClick={handleFilter}>Apply Filters</Button>
            <Button size="sm" variant="ghost" onClick={() => { setDepartment(''); setStatus(''); setFilters({}); }}>Clear</Button>
          </div>
        </Card>

        {/* Table */}
        <DataTable
          columns={ATTENDANCE_COLUMNS}
          data={records.slice(0, 50)}
          emptyMessage="No attendance records match the selected filters."
        />
      </div>
    </PageContainer>
  );
}
