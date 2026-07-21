import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartTooltip from '@/components/shared/charts/ChartTooltip';
import { MoreHorizontal } from 'lucide-react';

const CUSTOM_COLORS = ['#F59E0B', '#4F46E5', '#EF4444']; 

export default function AppCategoryDonut({ data }) {
  if (!data?.length) return null;

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%', position: 'relative' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
          App Information
        </h3>
        <MoreHorizontal size={20} color="var(--color-text-secondary)" style={{ cursor: 'pointer' }} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="75%" 
            outerRadius="90%"
            dataKey="value"
            nameKey="category"
            paddingAngle={0}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={CUSTOM_COLORS[i % CUSTOM_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="square" iconSize={12} wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text */}
      <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontSize: '32px', fontWeight: 800, color: '#111' }}>{totalValue.toLocaleString()}</div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Total Minutes<br/>This week</div>
      </div>
    </div>
  );
}
