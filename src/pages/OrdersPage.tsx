import { Package, ShoppingCart, Truck } from 'lucide-react'
import { KpiCard } from '../components/KpiCard'
import { OrdersTable } from '../components/OrdersTable'
import { SalesTrendChart } from '../components/SalesTrendChart'
import { TopSkusChart } from '../components/TopSkusChart'
import { courierMix, dailySales, kpiSummary, orderRows } from '../data/mockDashboard'

function formatCompact(n: number) {
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `PKR ${(n / 1_000).toFixed(1)}K`
  return `PKR ${new Intl.NumberFormat('en-PK').format(n)}`
}

export function OrdersPage() {
  const fulfilled = orderRows.filter((o) => o.fulfillment === 'Fulfilled').length
  const rate = orderRows.length ? Math.round((fulfilled / orderRows.length) * 100) : 0
  const cod = orderRows.filter((o) => o.payment === 'COD').length
  const codPct = orderRows.length ? Math.round((cod / orderRows.length) * 100) : 0

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Orders (sample set)"
          value={String(orderRows.length)}
          hint="Rows in table below"
          icon={ShoppingCart}
        />
        <KpiCard
          title="Fulfillment rate"
          value={`${rate}%`}
          hint="In this sample"
          icon={Package}
          accent="magenta"
        />
        <KpiCard
          title="COD share"
          value={`${codPct}%`}
          hint="Cash collection risk"
          icon={Truck}
        />
        <KpiCard
          title="Period revenue (demo)"
          value={formatCompact(kpiSummary.revenuePkr)}
          hint="Full window KPI"
          icon={ShoppingCart}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-surface p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-white">Revenue trend</h2>
          <p className="text-sm text-slate-500">Same series as dashboard — swap for your export dates</p>
          <SalesTrendChart data={dailySales} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface p-5">
          <h2 className="text-base font-semibold text-white">Courier mix (Aug sample)</h2>
          <p className="text-sm text-slate-500">From master-style ops data</p>
          <TopSkusChart data={courierMix.map((c) => ({ name: c.name, orders: c.orders }))} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-surface p-5">
        <h2 className="text-base font-semibold text-white">Recent orders</h2>
        <p className="text-sm text-slate-500">
          Mirrors Shopify export fields — import CSV to replace this table
        </p>
        <div className="mt-4">
          <OrdersTable rows={orderRows} />
        </div>
      </section>
    </div>
  )
}
