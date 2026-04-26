import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Row = {
  name: string
  b0_30: number
  b31_60: number
  b61_90: number
  b90p: number
}

const colors = {
  b0_30: '#22d3ee',
  b31_60: '#a78bfa',
  b61_90: '#fbbf24',
  b90p: '#f43f5e',
}

const labels: Record<keyof typeof colors, string> = {
  b0_30: '0–30 d',
  b31_60: '31–60 d',
  b61_90: '61–90 d',
  b90p: '90+ d',
}

export function AgingStackedChart({ data }: { data: Row[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: '#12161f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#f1f5f9',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => labels[value as keyof typeof colors] ?? value}
          />
          <Bar dataKey="b0_30" stackId="age" fill={colors.b0_30} name="b0_30" radius={[0, 0, 0, 0]} />
          <Bar dataKey="b31_60" stackId="age" fill={colors.b31_60} name="b31_60" />
          <Bar dataKey="b61_90" stackId="age" fill={colors.b61_90} name="b61_90" />
          <Bar dataKey="b90p" stackId="age" fill={colors.b90p} name="b90p" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
