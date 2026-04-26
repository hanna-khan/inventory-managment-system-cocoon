import type { ForecastRow } from '../data/mockDashboard'

export function ForecastTable({ rows }: { rows: ForecastRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="pb-3 pr-4">SKU</th>
            <th className="pb-3 pr-4">Product</th>
            <th className="pb-3 pr-4 text-right">Avg / day</th>
            <th className="pb-3 pr-4 text-right">FC 30d</th>
            <th className="pb-3 pr-4 text-right">EOQ</th>
            <th className="pb-3 pr-4 text-right">Safety</th>
            <th className="pb-3 pr-4 text-right">Suggest Qty</th>
            <th className="pb-3">Reorder by</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r) => (
            <tr key={r.sku} className="text-slate-200">
              <td className="py-3 pr-4 font-mono text-xs text-accent">{r.sku}</td>
              <td className="py-3 pr-4 font-medium text-white">{r.product}</td>
              <td className="py-3 pr-4 text-right tabular-nums">{r.avgDailyUnits.toFixed(1)}</td>
              <td className="py-3 pr-4 text-right tabular-nums">{r.forecast30d}</td>
              <td className="py-3 pr-4 text-right tabular-nums text-slate-400">{r.eoq}</td>
              <td className="py-3 pr-4 text-right tabular-nums text-slate-400">{r.safetyStock}</td>
              <td className="py-3 pr-4 text-right tabular-nums font-medium text-magenta">
                {r.suggestOrderQty === 0 ? '—' : r.suggestOrderQty}
              </td>
              <td className="py-3 font-mono text-xs text-slate-400">{r.reorderBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
