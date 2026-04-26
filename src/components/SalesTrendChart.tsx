import { useId } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyPoint } from '../data/mockDashboard'

const formatPkr = (n: number) => `PKR ${(n / 1_000_000).toFixed(2)}M`

type Props = { data: DailyPoint[] }

export function SalesTrendChart({ data }: Props) {
  const gid = useId().replace(/:/g, '')

  return (
    <div className="h-[220px] w-full min-w-0 sm:h-[260px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
          className="min-w-0"
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: '#12161f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#f1f5f9',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value, name) => [
              name === 'revenue' ? formatPkr(Number(value)) : String(value),
              name === 'revenue' ? 'Revenue' : 'Orders',
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22d3ee"
            strokeWidth={2}
            fill={`url(#${gid})`}
            dot={false}
            activeDot={{ r: 4, fill: '#22d3ee', stroke: '#0b0e14' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
