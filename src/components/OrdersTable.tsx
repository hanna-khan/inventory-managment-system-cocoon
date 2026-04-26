import type { OrderRow } from '../data/mockDashboard'

const pay: Record<OrderRow['payment'], string> = {
  COD: 'bg-slate-500/20 text-slate-200 ring-1 ring-white/10',
  'Online paid': 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25',
  Pending: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/25',
}

const ful: Record<OrderRow['fulfillment'], string> = {
  Fulfilled: 'text-emerald-400',
  Unfulfilled: 'text-rose-300',
  Partial: 'text-amber-300',
}

function formatPkr(n: number) {
  return `PKR ${new Intl.NumberFormat('en-PK').format(n)}`
}

export function OrdersTable({ rows }: { rows: OrderRow[] }) {
  return (
    <>
      <ul className="divide-y divide-white/10 md:hidden">
        {rows.map((r) => (
          <li key={r.id} className="py-3 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-medium text-accent">{r.id}</span>
              <span className={`text-xs font-medium ${ful[r.fulfillment]}`}>{r.fulfillment}</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{r.created}</p>
            <p className="mt-0.5 text-white">{r.city}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${pay[r.payment]}`}
              >
                {r.payment}
              </span>
              <span className="text-sm font-semibold text-white">{formatPkr(r.totalPkr)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{r.lineItems} line item(s)</p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="pb-3 pr-4">Order</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">City</th>
              <th className="pb-3 pr-4 text-right">Lines</th>
              <th className="pb-3 pr-4 text-right">Total</th>
              <th className="pb-3 pr-4">Payment</th>
              <th className="pb-3">Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.id} className="text-slate-200">
                <td className="py-3 pr-4 font-mono text-xs font-medium text-accent">{r.id}</td>
                <td className="py-3 pr-4 text-slate-400">{r.created}</td>
                <td className="py-3 pr-4 text-white">{r.city}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{r.lineItems}</td>
                <td className="py-3 pr-4 text-right font-medium tabular-nums text-white">
                  {formatPkr(r.totalPkr)}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${pay[r.payment]}`}
                  >
                    {r.payment}
                  </span>
                </td>
                <td className={`py-3 font-medium ${ful[r.fulfillment]}`}>{r.fulfillment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
