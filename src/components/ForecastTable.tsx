import type { ForecastRow } from '../data/mockDashboard'

export function ForecastTable({ rows }: { rows: ForecastRow[] }) {
  return (
    <>
      <ul className="divide-y divide-white/10 lg:hidden">
        {rows.map((r) => (
          <li key={r.sku} className="py-3 first:pt-0">
            <p className="font-mono text-xs text-accent">{r.sku}</p>
            <p className="mt-1 font-medium text-white">{r.product}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="text-slate-600">Avg / day</dt>
                <dd className="tabular-nums text-slate-200">{r.avgDailyUnits.toFixed(1)}</dd>
              </div>
              <div>
                <dt className="text-slate-600">FC 30d</dt>
                <dd className="tabular-nums text-slate-200">{r.forecast30d}</dd>
              </div>
              <div>
                <dt className="text-slate-600">EOQ</dt>
                <dd className="tabular-nums text-slate-400">{r.eoq}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Safety</dt>
                <dd className="tabular-nums text-slate-400">{r.safetyStock}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Suggest qty</dt>
                <dd className="font-medium tabular-nums text-magenta">
                  {r.suggestOrderQty === 0 ? '—' : r.suggestOrderQty}
                </dd>
              </div>
              <div>
                <dt className="text-slate-600">Reorder by</dt>
                <dd className="font-mono text-slate-400">{r.reorderBy}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto lg:block">
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
    </>
  )
}
