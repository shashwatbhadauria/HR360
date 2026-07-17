import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AreaChart, Area } from 'recharts';
import PageContainer from '@/components/shared/layout/PageContainer';
import Card from '@/components/shared/ui/Card';
import StatusBadge from '@/components/shared/ui/StatusBadge';
import ProgressBar from '@/components/shared/ui/ProgressBar';
import { SkeletonDashboard } from '@/components/shared/ui/Skeleton';
import ChartTooltip from '@/components/shared/charts/ChartTooltip';
import { AXIS_STYLE, GRID_STYLE, APP_CATEGORY_CHART_COLORS, CHART_COLORS } from '@/components/shared/charts/chartTheme';
import { formatDuration } from '@/utils/formatters';
import { getOrgAppUsage, getCategoryTrend } from '@/services/appUsageService';

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [trend, setTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [appsData, trendData] = await Promise.all([getOrgAppUsage(), getCategoryTrend()]);
      if (!cancelled) { setApps(appsData); setTrend(trendData); setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) return <PageContainer><SkeletonDashboard /></PageContainer>;

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Top apps bar chart */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Most Used Applications</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            Organization-wide application usage this month
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={apps.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid {...GRID_STYLE} horizontal={false} vertical={true} />
              <XAxis type="number" {...AXIS_STYLE} tickFormatter={(v) => formatDuration(v)} />
              <YAxis type="category" dataKey="app" {...AXIS_STYLE} width={80} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="totalMinutes" name="Total Time" radius={[0, 6, 6, 0]} barSize={24}>
                {apps.slice(0, 10).map((entry, i) => (
                  <Cell key={i} fill={APP_CATEGORY_CHART_COLORS[entry.category] || CHART_COLORS.neutral} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
          {/* Category trend */}
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Category Trend</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Weekly split of productive vs neutral vs distracting time
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="week" {...AXIS_STYLE} />
                <YAxis domain={[0, 100]} {...AXIS_STYLE} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="productive" name="Productive" stackId="1" stroke={CHART_COLORS.success} fill={CHART_COLORS.success} fillOpacity={0.3} />
                <Area type="monotone" dataKey="neutral" name="Neutral" stackId="1" stroke={CHART_COLORS.info} fill={CHART_COLORS.info} fillOpacity={0.3} />
                <Area type="monotone" dataKey="distracting" name="Distracting" stackId="1" stroke={CHART_COLORS.warning} fill={CHART_COLORS.warning} fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* App list */}
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>All Applications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {apps.map(app => (
                <div key={app.app} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ width: '80px', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.app}</span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={app.totalMinutes}
                      max={apps[0].totalMinutes}
                      status={app.category === 'productive' ? 'success' : app.category === 'neutral' ? 'info' : 'warning'}
                      height={6}
                      animated={false}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', width: '60px', textAlign: 'right' }}>
                    {formatDuration(app.totalMinutes)}
                  </span>
                  <StatusBadge status={app.category} size="sm" />
                  <span style={{
                    fontSize: '11px', fontWeight: 500, minWidth: '40px', textAlign: 'right',
                    color: app.trend > 0 ? 'var(--color-success)' : app.trend < 0 ? 'var(--color-danger)' : 'var(--color-neutral)',
                  }}>
                    {app.trend > 0 ? '↑' : app.trend < 0 ? '↓' : '='}{Math.abs(app.trend)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
