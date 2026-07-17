import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/shared/layout/PageContainer';
import Card from '@/components/shared/ui/Card';
import DataTable from '@/components/shared/ui/DataTable';
import StatusBadge from '@/components/shared/ui/StatusBadge';
import Avatar from '@/components/shared/ui/Avatar';
import ProgressBar from '@/components/shared/ui/ProgressBar';
import EmptyState from '@/components/shared/ui/EmptyState';
import Button from '@/components/shared/ui/Button';
import { SkeletonTable } from '@/components/shared/ui/Skeleton';
import { Search, UserPlus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { DEPARTMENTS } from '@/utils/constants';
import { formatHours } from '@/utils/formatters';
import { getEmployees } from '@/services/employeeService';

export default function EmployeeDirectoryPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getEmployees({ search: debouncedSearch, department: department || undefined });
        if (!cancelled) setEmployees(data);
      } catch { /* handled by service */ }
      finally { if (!cancelled) setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [debouncedSearch, department]);

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={val} size={36} />
          <div>
            <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{val}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.role}</div>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'hoursWorked',
      label: 'Hours (Weekly)',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
          <ProgressBar value={val} max={row.hoursAllotted} height={6} style={{ flex: 1 }} animated={false} />
          <span style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {formatHours(val)}
          </span>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      align: 'right',
      render: (val) => (
        <span style={{
          fontWeight: 600,
          fontFeatureSettings: '"tnum"',
          color: val >= 80 ? 'var(--color-success)' : val >= 65 ? 'var(--color-warning)' : 'var(--color-danger)',
        }}>
          {val}
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              {employees.length} employees
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card padding="12px 16px">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '360px' }}>
              <Search size={16} style={{
                position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)', pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="Search by name, email, department…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', height: '36px', padding: '0 12px 0 34px',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)', fontSize: '13px', fontFamily: 'var(--font-sans)',
                  color: 'var(--color-text-primary)', outline: 'none',
                }}
              />
            </div>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)',
              }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <SkeletonTable rows={8} cols={5} />
        ) : employees.length === 0 ? (
          <EmptyState title="No employees found" description="Try adjusting your search or filter criteria." />
        ) : (
          <DataTable
            columns={columns}
            data={employees}
            onRowClick={(row) => navigate(`/employees/${row.id}`)}
          />
        )}
      </div>
    </PageContainer>
  );
}
