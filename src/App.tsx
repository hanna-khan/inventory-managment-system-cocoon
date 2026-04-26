import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Boxes,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { CategorySplitChart } from './components/CategorySplitChart'
import { InventoryAlertsTable } from './components/InventoryAlertsTable'
import { KpiCard } from './components/KpiCard'
import { SalesTrendChart } from './components/SalesTrendChart'
import { Sidebar } from './components/Sidebar'
import { StockAlertsStrip } from './components/StockAlertsStrip'
import { TopBar } from './components/TopBar'
import { TopSkusChart } from './components/TopSkusChart'
import {
  buildStockAlerts,
  categorySplit,
  dailySales,
  kpiSummary,
  stockRows,
  systemAlerts,
  topSkus,
} from './data/mockDashboard'
import { ForecastPage } from './pages/ForecastPage'
import { InventoryPage } from './pages/InventoryPage'
import { OrdersPage } from './pages/OrdersPage'

function formatPkr(n: number) {
  return `PKR ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n)}`
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `PKR ${(n / 1_000).toFixed(1)}K`
  return formatPkr(n)
}

export default function App() {
  const [nav, setNav] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(() => new Set())
  const [alertsExpanded, setAlertsExpanded] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  const visibleAlerts = useMemo(() => {
    const merged = [...buildStockAlerts(stockRows), ...systemAlerts]
    return merged.filter((a) => !dismissedAlertIds.has(a.id))
  }, [dismissedAlertIds])

  const dismissAlert = useCallback((id: string) => {
    setDismissedAlertIds((prev) => new Set(prev).add(id))
  }, [])

  const goFromAlert = useCallback((target: 'inventory' | 'orders' | 'forecast') => {
    setNav(target)
  }, [])

  const titles = useMemo(
    () => ({
      dashboard: {
        title: 'Executive overview',
        subtitle: 'Inventory, sales, and fulfillment — demo data for Cocoon framework.',
      },
      inventory: {
        title: 'Inventory',
        subtitle: 'Deep stock analysis — wire to your ledger or count sheets.',
      },
      orders: {
        title: 'Orders',
        subtitle: 'Channel and fulfillment — connect Shopify / master sheet export.',
      },
      forecast: {
        title: 'Forecast & EOQ',
        subtitle: 'Demand forecast and reorder math — plug in your D, S, H, and lead time.',
      },
    }),
    [],
  )

  const meta = titles[nav as keyof typeof titles] ?? titles.dashboard

  return (
    <div className="flex min-h-screen min-w-0 bg-canvas">
      <Sidebar
        active={nav}
        onSelect={setNav}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          alertCount={visibleAlerts.length}
          onMenuClick={() => setMobileNavOpen(true)}
          onAlertsClick={
            visibleAlerts.length > 0
              ? () => setAlertsExpanded((o) => !o)
              : undefined
          }
        />
        <StockAlertsStrip
          alerts={visibleAlerts}
          expanded={alertsExpanded}
          onToggle={() => setAlertsExpanded((o) => !o)}
          onDismiss={dismissAlert}
          onGoTo={goFromAlert}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-6 lg:px-8">
          {nav === 'inventory' ? (
            <InventoryPage />
          ) : nav === 'orders' ? (
            <OrdersPage />
          ) : nav === 'forecast' ? (
            <ForecastPage />
          ) : (
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:gap-6">
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                <KpiCard
                  title="Inventory value"
                  value={formatCompact(kpiSummary.inventoryValuePkr)}
                  hint="Estimated retail / WAC"
                  trend={{ label: '↑ 6% vs last month', positive: true }}
                  icon={Wallet}
                />
                <KpiCard
                  title="Active SKUs"
                  value={String(kpiSummary.skuCount)}
                  hint="In catalog with movement"
                  icon={Boxes}
                  accent="magenta"
                />
                <KpiCard
                  title="Orders (period)"
                  value={new Intl.NumberFormat('en-PK').format(kpiSummary.ordersPeriod)}
                  hint="Sample August window"
                  trend={{ label: '↑ 18% vs July', positive: true }}
                  icon={ShoppingCart}
                />
                <KpiCard
                  title="Sales revenue"
                  value={formatCompact(kpiSummary.revenuePkr)}
                  hint="Gross merchandise value"
                  icon={TrendingUp}
                />
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                <KpiCard
                  title="Inventory turnover"
                  value={`${kpiSummary.turnoverRatio}×`}
                  hint="COGS / Avg inventory (illustrative)"
                  icon={RefreshCw}
                />
                <KpiCard
                  title="Stock-out rate"
                  value={`${kpiSummary.stockOutRatePct}%`}
                  hint="Lines unavailable / demand"
                  trend={{ label: 'Target < 2%', positive: false }}
                  icon={AlertTriangle}
                  accent="magenta"
                />
                <KpiCard
                  title="Dead stock value"
                  value={formatPkr(kpiSummary.deadStockPkr)}
                  hint="No sales 60–90d (example)"
                  icon={Package}
                />
                <KpiCard
                  title="Low-stock SKUs"
                  value={String(kpiSummary.lowStockCount)}
                  hint="Below reorder threshold"
                  trend={{ label: '3 critical', positive: false }}
                  icon={Boxes}
                  accent="magenta"
                />
              </section>

              <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 lg:col-span-2">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-white">Sales trend</h2>
                      <p className="text-xs text-slate-500 sm:text-sm">Revenue by day (sample)</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <span className="rounded-lg bg-accent-dim px-2 py-1 text-xs font-medium text-accent">
                        Revenue
                      </span>
                      <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-500">
                        Orders
                      </span>
                    </div>
                  </div>
                  <SalesTrendChart data={dailySales} />
                </div>
                <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
                  <h2 className="text-base font-semibold text-white">Category mix</h2>
                  <p className="text-sm text-slate-500">Share of demand (demo)</p>
                  <CategorySplitChart data={categorySplit} />
                  <ul className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                    {categorySplit.map((c, i) => (
                      <li key={c.name}>
                        <span
                          className="mr-1 inline-block size-2 rounded-full align-middle"
                          style={{
                            background: ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24'][i % 4],
                          }}
                        />
                        {c.name} {c.value}%
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
                  <h2 className="text-base font-semibold text-white">Top SKUs</h2>
                  <p className="text-sm text-slate-500">Order volume — align with master sheet</p>
                  <TopSkusChart data={topSkus} />
                </div>
                <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
                  <h2 className="text-base font-semibold text-white">Stock health</h2>
                  <p className="text-sm text-slate-500">On-hand vs reorder (sample)</p>
                  <InventoryAlertsTable rows={stockRows} />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
