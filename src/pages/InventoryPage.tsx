import { useState } from 'react'
import { AlertTriangle, Boxes, Package, Plus, Wallet } from 'lucide-react'
import { AgingStackedChart } from '../components/AgingStackedChart'
import { CategorySplitChart } from '../components/CategorySplitChart'
import { InventoryAlertsTable } from '../components/InventoryAlertsTable'
import { KpiCard } from '../components/KpiCard'
import { RightDrawer } from '../components/RightDrawer'

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

const inputCls =
  'w-full rounded-xl border border-white/10 bg-surface-elevated px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none ring-accent/40 focus:ring-2 transition [color-scheme:dark]'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400">
        {label}{required && <span className="ml-0.5 text-magenta">*</span>}
      </label>
      {children}
    </div>
  )
}

const CATEGORIES = ['Pret', 'Lawn', 'Unstitched', 'Festive', 'Other']
const SUPPLIERS = ['Al-Rahim Textiles', 'Faisal Fabrics', 'Karachi Emb. Co.', 'Lahore Prints', 'Other']

type StockForm = { product: string; sku: string; category: string; supplier: string; onHand: string; reorderPoint: string; unitCost: string; location: string }
const EMPTY_STOCK: StockForm = { product: '', sku: '', category: '', supplier: '', onHand: '', reorderPoint: '', unitCost: '', location: '' }

function AddStockForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState<StockForm>(EMPTY_STOCK)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof StockForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setForm(EMPTY_STOCK); onDone() }, 1800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-dim text-accent">
          <Package className="size-7" strokeWidth={1.75} />
        </div>
        <p className="text-base font-semibold text-white">Stock added!</p>
        <p className="text-sm text-slate-500">Inventory record has been saved.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Product name" required>
        <input value={form.product} onChange={set('product')} placeholder="e.g. Eclipse Garden" required className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU" required>
          <input value={form.sku} onChange={set('sku')} placeholder="SKU code" required className={inputCls} />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={set('category')} className={inputCls}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Supplier">
        <select value={form.supplier} onChange={set('supplier')} className={inputCls}>
          <option value="">Select supplier…</option>
          {SUPPLIERS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="On hand (units)" required>
          <input type="number" min={0} value={form.onHand} onChange={set('onHand')} placeholder="0" required className={inputCls} />
        </Field>
        <Field label="Reorder point">
          <input type="number" min={0} value={form.reorderPoint} onChange={set('reorderPoint')} placeholder="0" className={inputCls} />
        </Field>
      </div>
      <Field label="Unit cost (PKR)">
        <input type="number" min={0} value={form.unitCost} onChange={set('unitCost')} placeholder="0" className={inputCls} />
      </Field>
      <Field label="Storage location">
        <input value={form.location} onChange={set('location')} placeholder="e.g. Warehouse A, Shelf 3" className={inputCls} />
      </Field>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 active:scale-[0.98]">
          <Plus className="size-4" strokeWidth={2.5} /> Add stock
        </button>
      </div>
    </form>
  )
}

export function InventoryPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const critical = stockRows.filter((r) => r.status === 'critical').length
  const low = stockRows.filter((r) => r.status === 'low').length

  return (
    <>
      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add stock"
        subtitle="Create a new inventory record"
        icon={<Package className="size-5" strokeWidth={1.75} />}
      >
        <AddStockForm onDone={() => setDrawerOpen(false)} />
      </RightDrawer>
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Stock vs reorder</h2>
            <p className="text-xs text-slate-500 sm:text-sm">SKUs below policy — replace with live counts</p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-canvas transition hover:brightness-110"
          >
            <Plus className="size-4 shrink-0" strokeWidth={2.5} />
            Add stock
          </button>
        </div>
        <div className="mt-3 sm:mt-4">
          <InventoryAlertsTable rows={stockRows} />
        </div>
      </section>
      </div>
    </>
  )
}
