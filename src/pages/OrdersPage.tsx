import { useState } from 'react'
import { Package, Plus, ShoppingCart, Truck } from 'lucide-react'
import { KpiCard } from '../components/KpiCard'
import { OrdersTable } from '../components/OrdersTable'
import { RightDrawer } from '../components/RightDrawer'
import { SalesTrendChart } from '../components/SalesTrendChart'
import { TopSkusChart } from '../components/TopSkusChart'
import { courierMix, dailySales, kpiSummary, orderRows } from '../data/mockDashboard'

function formatCompact(n: number) {
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `PKR ${(n / 1_000).toFixed(1)}K`
  return `PKR ${new Intl.NumberFormat('en-PK').format(n)}`
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

type OrderForm = { product: string; sku: string; quantity: string; channel: string; courier: string; city: string; payment: string; notes: string }
const EMPTY_ORDER: OrderForm = { product: '', sku: '', quantity: '', channel: '', courier: '', city: '', payment: '', notes: '' }

function CreateOrderForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState<OrderForm>(EMPTY_ORDER)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof OrderForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setForm(EMPTY_ORDER); onDone() }, 1800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-dim text-accent">
          <ShoppingCart className="size-7" strokeWidth={1.75} />
        </div>
        <p className="text-base font-semibold text-white">Order created!</p>
        <p className="text-sm text-slate-500">Your order has been queued successfully.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Product name" required>
        <input value={form.product} onChange={set('product')} placeholder="e.g. Gulaab 2-Piece" required className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU">
          <input value={form.sku} onChange={set('sku')} placeholder="e.g. FPS2610011-4" className={inputCls} />
        </Field>
        <Field label="Quantity" required>
          <input type="number" min={1} value={form.quantity} onChange={set('quantity')} placeholder="Units" required className={inputCls} />
        </Field>
      </div>
      <Field label="Sales channel">
        <select value={form.channel} onChange={set('channel')} className={inputCls}>
          <option value="">Select channel…</option>
          {['Shopify', 'WhatsApp', 'Walk-in', 'Instagram', 'Daraz'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Payment">
          <select value={form.payment} onChange={set('payment')} className={inputCls}>
            <option value="">Select…</option>
            {['COD', 'Online paid', 'Pending'].map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="City">
          <input value={form.city} onChange={set('city')} placeholder="e.g. Karachi" className={inputCls} />
        </Field>
      </div>
      <Field label="Courier">
        <select value={form.courier} onChange={set('courier')} className={inputCls}>
          <option value="">Select courier…</option>
          {['TCS', 'Leopards', 'Postex', 'Trax', 'Mudassir', 'Skynet'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Notes">
        <textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="Special instructions…" className={`${inputCls} resize-none`} />
      </Field>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 active:scale-[0.98]">
          <Plus className="size-4" strokeWidth={2.5} /> Create order
        </button>
      </div>
    </form>
  )
}

export function OrdersPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const fulfilled = orderRows.filter((o) => o.fulfillment === 'Fulfilled').length
  const rate = orderRows.length ? Math.round((fulfilled / orderRows.length) * 100) : 0
  const cod = orderRows.filter((o) => o.payment === 'COD').length
  const codPct = orderRows.length ? Math.round((cod / orderRows.length) * 100) : 0

  return (
    <>
      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Create order"
        subtitle="New sales or manual order entry"
        icon={<ShoppingCart className="size-5" strokeWidth={1.75} />}
      >
        <CreateOrderForm onDone={() => setDrawerOpen(false)} />
      </RightDrawer>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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

      <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-white">Revenue trend</h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Same series as dashboard — swap for your export dates
          </p>
          <SalesTrendChart data={dailySales} />
        </div>
        <div className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Courier mix (Aug sample)</h2>
          <p className="text-xs text-slate-500 sm:text-sm">From master-style ops data</p>
          <TopSkusChart data={courierMix.map((c) => ({ name: c.name, orders: c.orders }))} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Recent orders</h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              Mirrors Shopify export fields — import CSV to replace this table
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-canvas transition hover:brightness-110"
          >
            <Plus className="size-4 shrink-0" strokeWidth={2.5} />
            Create order
          </button>
        </div>
        <div className="mt-3 sm:mt-4">
          <OrdersTable rows={orderRows} />
        </div>
      </section>
      </div>
    </>
  )
}
