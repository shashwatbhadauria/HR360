import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import PageContainer from '@/components/shared/layout/PageContainer';
import Card from '@/components/shared/ui/Card';
import Avatar from '@/components/shared/ui/Avatar';
import StatusBadge from '@/components/shared/ui/StatusBadge';
import ProgressBar from '@/components/shared/ui/ProgressBar';
import Button from '@/components/shared/ui/Button';
import EmptyState from '@/components/shared/ui/EmptyState';
import { SkeletonDashboard } from '@/components/shared/ui/Skeleton';
import { formatHours, formatDuration } from '@/utils/formatters';
import { getScoreLabel, getScoreStatus } from '@/utils/productivityScore';
import { APP_CATEGORY_COLORS } from '@/utils/constants';
import { getEmployeeById } from '@/services/employeeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartTooltip from '@/components/shared/charts/ChartTooltip';
import { AXIS_STYLE, GRID_STYLE, CHART_COLORS } from '@/components/shared/charts/chartTheme';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getEmployeeById(id);
        if (!cancelled) setEmployee(data);
      } catch { /* handled by service */ }
      finally { if (!cancelled) setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (isLoading) return <PageContainer><SkeletonDashboard /></PageContainer>;
  if (!employee) return <PageContainer><EmptyState title="Employee not found" actionLabel="Back to directory" onAction={() => navigate('/employees')} /></PageContainer>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'apps', label: 'App Usage' },
    { id: 'documents', label: 'Documents' },
    { id: 'history', label: 'History' },
  ];

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/employees')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', color: 'var(--color-text-secondary)',
            cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)', padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to directory
        </button>

        {/* Profile header */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Avatar name={employee.name} size={64} />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '22px', fontWeight: 600 }}>{employee.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '2px' }}>
                {employee.role} · {employee.department}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <StatusBadge status={employee.status} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Productivity Score</div>
              <div style={{
                fontSize: '32px', fontWeight: 700, fontFeatureSettings: '"tnum"',
                color: `var(--color-${getScoreStatus(employee.score)})`,
              }}>
                {employee.score}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{getScoreLabel(employee.score)}</div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--color-border)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-brand)' : '2px solid transparent',
                marginBottom: '-2px',
                color: activeTab === tab.id ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '14px', fontFamily: 'var(--font-sans)',
                cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Hours this week */}
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Hours This Week</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {formatHours(employee.hoursWorked)} / {formatHours(employee.hoursAllotted)}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>
                  {((employee.hoursWorked / employee.hoursAllotted) * 100).toFixed(0)}%
                </span>
              </div>
              <ProgressBar value={employee.hoursWorked} max={employee.hoursAllotted} height={10} />
              <ResponsiveContainer width="100%" height={180} style={{ marginTop: '20px' }}>
                <BarChart data={employee.weeklyHours} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis dataKey="day" {...AXIS_STYLE} />
                  <YAxis domain={[0, 10]} {...AXIS_STYLE} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="hours" name="Hours" fill={CHART_COLORS.brand} radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Attendance summary */}
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Attendance (This Month)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Present', value: employee.attendanceSummary.present, color: 'var(--color-success)' },
                  { label: 'Late', value: employee.attendanceSummary.late, color: 'var(--color-warning)' },
                  { label: 'Absent', value: employee.attendanceSummary.absent, color: 'var(--color-danger)' },
                  { label: 'WFH', value: employee.attendanceSummary.wfh, color: 'var(--color-info)' },
                  { label: 'On Leave', value: employee.attendanceSummary.onLeave, color: 'var(--color-neutral)' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                    </div>
                    <span style={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                      {item.value} day{item.value !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Score breakdown */}
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Score Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Hours Utilization', value: employee.breakdown.hours, weight: '40%' },
                  { label: 'Productive App Usage', value: employee.breakdown.apps, weight: '35%' },
                  { label: 'Attendance Consistency', value: employee.breakdown.attendance, weight: '25%' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {item.label} ({item.weight})
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.value}%</span>
                    </div>
                    <ProgressBar value={item.value} max={100} height={6} animated={false} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'apps' && (
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Top Applications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {employee.topApps.map(app => (
                <div key={app.app} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '100px', fontSize: '13px', fontWeight: 500 }}>{app.app}</span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={app.minutes}
                      max={employee.topApps[0].minutes}
                      status={app.category === 'productive' ? 'success' : app.category === 'neutral' ? 'info' : 'warning'}
                      height={8}
                      animated={false}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', width: '50px', textAlign: 'right' }}>
                    {formatDuration(app.minutes)}
                  </span>
                  <StatusBadge status={app.category} size="sm" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Manage and download employee files securely.</p>
              {/* Note: In a real app, this button would only be visible to HR Admins */}
              <Button size="sm" onClick={() => window.alert('Opening Admin Upload Modal (e.g. upload new salary slip)')}>
                <Upload size={16} style={{ marginRight: '6px' }} /> Upload Document
              </Button>
            </div>
            
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Onboarding Documents</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-brand)' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Offer Letter</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Signed on joining date • PDF</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.alert('Downloading Offer Letter...')}>
                  <Download size={16} style={{ marginRight: '6px' }} /> Download
                </Button>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Payroll & Salary Slips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['May 2026', 'April 2026', 'March 2026'].map((month, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)' }}>
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Salary Slip - {month}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Generated on 1st of next month • PDF</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => window.alert(`Downloading ${month} Salary Slip...`)}>
                      <Download size={16} style={{ marginRight: '6px' }} /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <EmptyState
              title="Historical data"
              description="Detailed historical trend charts will appear here as more screentime data is collected over time."
            />
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
