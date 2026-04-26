import { Calculator, LineChart, Package } from 'lucide-react'
import { KpiCard } from '../components/KpiCard'
import { ForecastTable } from '../components/ForecastTable'
import { SalesTrendChart } from '../components/SalesTrendChart'
import { dailySales, forecastRows, kpiSummary } from '../data/mockDashboard'

export function ForecastPage() {
  const totalSuggest = forecastRows.reduce((s, r) => s + r.suggestOrderQty, 0)
  const avgEoq =
    forecastRows.length > 0
      ? forecastRows.reduce((s, r) => s + r.eoq, 0) / forecastRows.length
      : 0

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <KpiCard
          title="Suggested buy (demo)"
          value={String(totalSuggest)}
          hint="Sum of suggest order qty"
          icon={Package}
          accent="magenta"
        />
        <KpiCard
          title="Avg EOQ (sample SKUs)"
          value={avgEoq.toFixed(0)}
          hint="√(2DS/H) — document D,S,H"
          icon={Calculator}
        />
        <KpiCard
          title="Turnover (context)"
          value={`${kpiSummary.turnoverRatio}×`}
          hint="Link forecast to policy"
          icon={LineChart}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-surface/60 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Method note</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
          <strong className="text-slate-300">Forecast 30d</strong> is illustrative (avg daily × 30). Replace
          with <strong className="text-slate-300">moving average</strong> or trend on your order history.
          <strong className="text-slate-300"> EOQ</strong> uses assumed ordering and holding costs — state them
          in your FYP report. <strong className="text-slate-300">Safety stock</strong> can be z × σ × √L once
          you estimate demand variability and lead time L.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Demand history (proxy)</h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Use this curve to fit SMA / trend in Excel or API
          </p>
          <SalesTrendChart data={dailySales} />
        </div>
        <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Reorder recommendations</h2>
          <p className="text-xs text-slate-500 sm:text-sm">EOQ + safety + suggested quantity by SKU</p>
          <div className="mt-3 sm:mt-4">
            <ForecastTable rows={forecastRows} />
          </div>
        </div>
      </section>
    </div>
  )
}
