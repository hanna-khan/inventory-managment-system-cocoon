import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type Row = { name: string; value: number }

const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24']

export function CategorySplitChart({ data }: { data: Row[] }) {
  return (
    <div className="mx-auto h-[220px] w-full max-w-full min-w-0 sm:h-[240px] md:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="52%"
            outerRadius="82%"
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#12161f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#f1f5f9',
            }}
            formatter={(value) => [`${value}%`, 'Share']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
