import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/shared/ui/Card';
import ChartTooltip from '@/components/shared/charts/ChartTooltip';
import { AXIS_STYLE, GRID_STYLE, CHART_COLORS } from '@/components/shared/charts/chartTheme';

/**
 * Org-wide hours trend area chart — 30-day view.
 */
export default function HoursTrendChart({ data }) {
  if (!data?.length) return null;

  return (
    <Card>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Hours Trend
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Avg daily hours worked across the organization
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.brand} stopOpacity={0.2} />
              <stop offset="100%" stopColor={CHART_COLORS.brand} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="date" {...AXIS_STYLE} />
          <YAxis domain={[5, 9]} {...AXIS_STYLE} tickFormatter={(v) => `${v}h`} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="hours"
            name="Avg Hours"
            stroke={CHART_COLORS.brand}
            strokeWidth={2.5}
            fill="url(#hoursGradient)"
            dot={false}
            activeDot={{ r: 5, fill: CHART_COLORS.brand, strokeWidth: 2, stroke: '#fff' }}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
