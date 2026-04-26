import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Row = { name: string; orders: number }

const BAR = '#ec4899'

export function TopSkusChart({ data }: { data: Row[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={108}
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              background: '#12161f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#f1f5f9',
            }}
            formatter={(value) => [`${value} orders`, 'Volume']}
          />
          <Bar dataKey="orders" radius={[0, 8, 8, 0]} barSize={14}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={BAR}
                style={{
                  filter: i === 0 ? 'drop-shadow(0 0 10px rgba(236,72,153,0.45))' : undefined,
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
