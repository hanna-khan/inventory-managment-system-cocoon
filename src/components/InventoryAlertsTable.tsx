import type { StockRow } from '../data/mockDashboard'

const badge: Record<StockRow['status'], string> = {
  ok: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  low: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30',
  critical: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/35',
}

const label: Record<StockRow['status'], string> = {
  ok: 'Healthy',
  low: 'Low',
  critical: 'Reorder',
}

export function InventoryAlertsTable({ rows }: { rows: StockRow[] }) {
  return (
    <>
      <ul className="divide-y divide-white/10 md:hidden">
        {rows.map((r) => (
          <li key={r.sku} className="py-3 first:pt-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono text-xs text-accent">{r.sku}</p>
              <span
                className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badge[r.status]}`}
              >
                {label[r.status]}
              </span>
            </div>
            <p className="mt-1 font-medium text-white">{r.product}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-400">
              <div>
                <dt className="text-slate-600">Category</dt>
                <dd className="text-slate-300">{r.category}</dd>
              </div>
              <div>
                <dt className="text-slate-600">On hand</dt>
                <dd className="tabular-nums text-white">{r.onHand}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Reorder</dt>
                <dd className="tabular-nums">{r.reorder}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Days cover</dt>
                <dd className="tabular-nums text-white">{r.daysCover}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="pb-3 pr-4">SKU</th>
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4 text-right">On hand</th>
              <th className="pb-3 pr-4 text-right">Reorder</th>
              <th className="pb-3 pr-4 text-right">Days cover</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.sku} className="text-slate-200">
                <td className="py-3 pr-4 font-mono text-xs text-accent">{r.sku}</td>
                <td className="py-3 pr-4 font-medium text-white">{r.product}</td>
                <td className="py-3 pr-4 text-slate-400">{r.category}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{r.onHand}</td>
                <td className="py-3 pr-4 text-right tabular-nums text-slate-400">{r.reorder}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{r.daysCover}</td>
                <td className="py-3 text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge[r.status]}`}
                  >
                    {label[r.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
