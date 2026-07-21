import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '@/components/shared/ui/Card';
import ChartTooltip from '@/components/shared/charts/ChartTooltip';
import { AXIS_STYLE, GRID_STYLE, CHART_COLORS } from '@/components/shared/charts/chartTheme';
import { getUtilizationStatus } from '@/utils/formatters';

const STATUS_COLORS = {
  success: CHART_COLORS.success,
  warning: CHART_COLORS.warning,
  danger: CHART_COLORS.danger,
};

export default function DepartmentBarChart({ data }) {
  if (!data?.length) return null;

  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Department Comparison
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Hours utilization by department
        </p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 24, bottom: 0 }} barSize={16}>
          <defs>
            <linearGradient id="colorSuccess" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={STATUS_COLORS.success} stopOpacity={0.6} />
              <stop offset="100%" stopColor={STATUS_COLORS.success} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="colorWarning" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={STATUS_COLORS.warning} stopOpacity={0.6} />
              <stop offset="100%" stopColor={STATUS_COLORS.warning} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="colorDanger" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={STATUS_COLORS.danger} stopOpacity={0.6} />
              <stop offset="100%" stopColor={STATUS_COLORS.danger} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_STYLE} horizontal={false} vertical={true} />
          <XAxis type="number" domain={[0, 100]} {...AXIS_STYLE} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="department" {...AXIS_STYLE} width={90} />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="utilization"
            name="Utilization"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, i) => {
              const status = getUtilizationStatus(entry.utilization);
              return (
                <Cell
                  key={i}
                  fill={`url(#color${status.charAt(0).toUpperCase() + status.slice(1)})`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
