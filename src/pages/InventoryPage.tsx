import { AlertTriangle, Boxes, Package, Wallet } from 'lucide-react'
import { AgingStackedChart } from '../components/AgingStackedChart'
import { CategorySplitChart } from '../components/CategorySplitChart'
import { InventoryAlertsTable } from '../components/InventoryAlertsTable'
import { KpiCard } from '../components/KpiCard'

import {
  agingByCategory,
  categorySplit,
  kpiSummary,
  stockRows,
} from '../data/mockDashboard'

function formatPkr(n: number) {
  return `PKR ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n)}`
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `PKR ${(n / 1_000).toFixed(1)}K`
  return formatPkr(n)
}

export function InventoryPage() {
  const critical = stockRows.filter((r) => r.status === 'critical').length
  const low = stockRows.filter((r) => r.status === 'low').length

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          title="Inventory value"
          value={formatCompact(kpiSummary.inventoryValuePkr)}
          hint="Demo WAC / retail"
          icon={Wallet}
        />
        <KpiCard
          title="Active SKUs"
          value={String(kpiSummary.skuCount)}
          icon={Boxes}
          accent="magenta"
        />
        <KpiCard
          title="Low + critical"
          value={String(low + critical)}
          hint={`${critical} critical · ${low} low`}
          trend={
            critical > 0
              ? { label: `${critical} need reorder`, positive: false }
              : { label: 'Within policy', positive: true }
          }
          icon={AlertTriangle}
          accent="magenta"
        />
        <KpiCard
          title="Dead stock (demo)"
          value={formatPkr(kpiSummary.deadStockPkr)}
          hint="No sales 60–90d"
          icon={Package}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-white">Inventory aging by category</h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Stacked units — hook to stock snapshot + GRN dates
          </p>
          <AgingStackedChart data={agingByCategory} />
        </div>
        <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Category mix</h2>
          <p className="text-xs text-slate-500 sm:text-sm">Demand share (same as overview)</p>
          <CategorySplitChart data={categorySplit} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Stock vs reorder</h2>
        <p className="text-xs text-slate-500 sm:text-sm">SKUs below policy — replace with live counts</p>
        <div className="mt-3 sm:mt-4">
          <InventoryAlertsTable rows={stockRows} />
        </div>
      </section>
    </div>
  )
}
