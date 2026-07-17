import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '@/components/shared/ui/Card';
import ChartTooltip from '@/components/shared/charts/ChartTooltip';

export default function AppCategoryDonut({ data }) {
  if (!data?.length) return null;

  return (
    <Card>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          App Usage by Category
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Organization-wide application time split
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            dataKey="value"
            nameKey="category"
            paddingAngle={3}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          letterSpacing: '-1px',
          lineHeight: '1',
        }}>
          {data.find(d => d.category === 'Productive')?.value || 0}%
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--color-success)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginTop: '4px',
        }}>
          Productive
        </div>
      </div>
    </Card>
  );
}
