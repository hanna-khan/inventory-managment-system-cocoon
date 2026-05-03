import { useState, useMemo } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { skuCatalogRows, type SkuCatalogRow } from '../data/mockDashboard'

const CATEGORIES = ['All Categories', 'Pret', 'Lawn', 'Unstitched', 'Festive']
const STATUSES = ['All Statuses', 'active', 'low', 'critical']

const STATUS_CFG = {
  active:   { label: 'Active',    cls: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/25' },
  low:      { label: 'Low Stock', cls: 'bg-amber-500/15  text-amber-400  ring-amber-500/25' },
  critical: { label: 'Critical',  cls: 'bg-magenta-dim   text-magenta    ring-magenta/25' },
} as const

const CAT_COLORS: Record<string, string> = {
  Pret:       'bg-accent-dim text-accent',
  Lawn:       'bg-emerald-500/15 text-emerald-400',
  Unstitched: 'bg-violet-500/15 text-violet-400',
  Festive:    'bg-amber-500/15 text-amber-400',
}

function StockBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const color = value === 0 ? 'bg-slate-700' : pct < 35 ? 'bg-magenta' : pct < 60 ? 'bg-amber-400' : 'bg-emerald-400'
  return (
    <div className="flex items-center gap-2">
      <span className={`w-6 text-right text-xs font-medium tabular-nums ${value === 0 ? 'text-slate-600' : 'text-white'}`}>
        {value}
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function SkuCatalogPage() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  const filtered = useMemo(() => {
    return skuCatalogRows.filter((r) => {
      const matchSearch =
        !search ||
        r.sku.toLowerCase().includes(search.toLowerCase()) ||
        r.product.toLowerCase().includes(search.toLowerCase()) ||
        r.supplier.toLowerCase().includes(search.toLowerCase())
      const matchCat = catFilter === 'All Categories' || r.category === catFilter
      const matchStatus = statusFilter === 'All Statuses' || r.status === statusFilter
      return matchSearch && matchCat && matchStatus
    })
  }, [search, catFilter, statusFilter])

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" strokeWidth={1.75} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or product…"
            className="min-h-9 w-full rounded-xl border border-white/10 bg-surface py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none ring-accent/40 focus:ring-2"
          />
        </div>

        {/* Category filter */}
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="min-h-9 rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm text-slate-300 outline-none ring-accent/40 focus:ring-2 [color-scheme:dark]"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-9 rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm text-slate-300 outline-none ring-accent/40 focus:ring-2 [color-scheme:dark]"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'All Statuses' ? s : STATUS_CFG[s as keyof typeof STATUS_CFG].label}</option>)}
        </select>

        <span className="ml-auto text-xs text-slate-500">
          Showing {filtered.length} SKU{filtered.length !== 1 ? 's' : ''}
        </span>

        {/* Export */}
        <button
          type="button"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm text-slate-300 transition hover:border-accent/30 hover:text-white"
        >
          <Download className="size-4 shrink-0" strokeWidth={1.75} />
          Export
        </button>

        {/* Add SKU */}
        <button
          type="button"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-canvas transition hover:brightness-110"
        >
          <Plus className="size-4 shrink-0" strokeWidth={2.5} />
          Add SKU
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['SKU / Product', 'Category', 'Supplier', 'Unit Cost', 'Retail Price', 'Margin', 'On Hand', 'Reorder Pt.', 'Lead Time', 'Last Sold', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-sm text-slate-600">
                    No SKUs match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <SkuRow key={row.sku} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SkuRow({ row }: { row: SkuCatalogRow }) {
  const statusCfg = STATUS_CFG[row.status]
  const catColor = CAT_COLORS[row.category] ?? 'bg-white/10 text-slate-300'

  return (
    <tr className="group transition hover:bg-white/[0.03]">
      {/* SKU + product */}
      <td className="py-3 pl-5 pr-4">
        <p className="font-medium text-white">{row.product}</p>
        <p className="mt-0.5 font-mono text-[11px] text-slate-500">{row.sku}</p>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor}`}>
          {row.category}
        </span>
      </td>

      {/* Supplier */}
      <td className="px-4 py-3 text-xs text-slate-400 max-w-[120px]">
        <span className="line-clamp-2">{row.supplier}</span>
      </td>

      {/* Unit cost */}
      <td className="px-4 py-3 tabular-nums text-slate-300">
        PKR {row.unitCost.toLocaleString('en-PK')}
      </td>

      {/* Retail price */}
      <td className="px-4 py-3 tabular-nums text-white">
        PKR {row.retailPrice.toLocaleString('en-PK')}
      </td>

      {/* Margin */}
      <td className="px-4 py-3">
        <span className="font-medium text-emerald-400">{row.margin}%</span>
      </td>

      {/* On hand with bar */}
      <td className="px-4 py-3">
        <StockBar value={row.onHand} max={row.reorderPoint * 2} />
      </td>

      {/* Reorder point */}
      <td className="px-4 py-3 tabular-nums text-slate-400">{row.reorderPoint}</td>

      {/* Lead time */}
      <td className="px-4 py-3 tabular-nums text-slate-400">{row.leadTimeDays}d</td>

      {/* Last sold */}
      <td className="px-4 py-3 text-xs text-slate-400">{row.lastSold}</td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusCfg.cls}`}>
          {statusCfg.label}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 pl-2 pr-5">
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 transition hover:bg-magenta-dim hover:text-magenta"
          >
            Del
          </button>
        </div>
      </td>
    </tr>
  )
}
