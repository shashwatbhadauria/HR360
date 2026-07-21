import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartTooltip from '@/components/shared/charts/ChartTooltip';
import { MoreHorizontal } from 'lucide-react';

export default function HoursTrendChart({ data }) {
  if (!data?.length) return null;

  // Take only the last 7 days to mimic the image's "Mon-Sun" look
  const weeklyData = data.slice(-7).map((d, i) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return { ...d, displayDay: days[i] };
  });

  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
          Total Hours
        </h3>
        <MoreHorizontal size={20} color="var(--color-text-secondary)" style={{ cursor: 'pointer' }} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={weeklyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="displayDay" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(v) => `${v}h`} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="hours" radius={[8, 8, 8, 8]} barSize={40}>
            {weeklyData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={'#4F46E5'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
