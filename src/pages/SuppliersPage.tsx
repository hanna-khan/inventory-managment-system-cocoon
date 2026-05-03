import { useState, useMemo } from 'react'
import { Download, Mail, Phone, Plus, Search } from 'lucide-react'
import { supplierRows, type SupplierRow } from '../data/mockDashboard'

const ALL_CATEGORIES = ['All Categories', 'Fabric', 'Embroidery', 'Printing', 'Packaging', 'Accessories']
const ALL_STATUSES = ['All Statuses', 'Active', 'Overdue']

const CAT_COLORS: Record<string, string> = {
  Fabric:       'bg-accent-dim text-accent',
  Embroidery:   'bg-violet-500/15 text-violet-400',
  Printing:     'bg-emerald-500/15 text-emerald-400',
  Packaging:    'bg-amber-500/15 text-amber-400',
  Accessories:  'bg-pink-500/15 text-pink-400',
}

function formatPkr(n: number) {
  return `PKR ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n)}`
}

export function SuppliersPage() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  const filtered = useMemo(() => {
    return supplierRows.filter((r) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(q) ||
        r.supplierId.toLowerCase().includes(q) ||
        r.contactName.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      const matchCat = catFilter === 'All Categories' || r.category === catFilter
      // "Overdue" = outstanding > 0 and lastOrder is old (simple heuristic)
      const isOverdue = r.outstandingPkr > 200_000
      const matchStatus =
        statusFilter === 'All Statuses' ||
        (statusFilter === 'Overdue' && isOverdue) ||
        (statusFilter === 'Active' && !isOverdue)
      return matchSearch && matchCat && matchStatus
    })
  }, [search, catFilter, statusFilter])

  const totalOutstanding = useMemo(
    () => supplierRows.reduce((s, r) => s + r.outstandingPkr, 0),
    [],
  )

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:gap-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total suppliers', value: String(supplierRows.length) },
          { label: 'Total outstanding', value: formatPkr(totalOutstanding) },
          { label: 'Avg lead time', value: `${Math.round(supplierRows.reduce((s, r) => s + r.leadTimeDays, 0) / supplierRows.length)}d` },
          { label: 'Active SKUs covered', value: String(supplierRows.reduce((s, r) => s + r.activeSkus, 0)) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-surface px-4 py-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" strokeWidth={1.75} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supplier…"
            className="min-h-9 w-full rounded-xl border border-white/10 bg-surface py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none ring-accent/40 focus:ring-2"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-9 rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm text-slate-300 outline-none ring-accent/40 focus:ring-2 [color-scheme:dark]"
        >
          {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="min-h-9 rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm text-slate-300 outline-none ring-accent/40 focus:ring-2 [color-scheme:dark]"
        >
          {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <span className="ml-auto text-xs text-slate-500">
          Showing {filtered.length} supplier{filtered.length !== 1 ? 's' : ''}
        </span>

        <button
          type="button"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm text-slate-300 transition hover:border-accent/30 hover:text-white"
        >
          <Download className="size-4 shrink-0" strokeWidth={1.75} />
          Export
        </button>

        <button
          type="button"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-canvas transition hover:brightness-110"
        >
          <Plus className="size-4 shrink-0" strokeWidth={2.5} />
          Add Supplier
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Supplier ID', 'Name & Email', 'Contact & Phone', 'City', 'Category', 'Payment Terms', 'Lead Time', 'Last Order', 'Outstanding (PKR)', 'SKUs', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-sm text-slate-600">
                    No suppliers match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <SupplierRow key={row.supplierId} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SupplierRow({ row }: { row: SupplierRow }) {
  const catColor = CAT_COLORS[row.category] ?? 'bg-white/10 text-slate-300'
  const isHighOutstanding = row.outstandingPkr > 300_000

  return (
    <tr className="group transition hover:bg-white/[0.03]">
      {/* Supplier ID */}
      <td className="py-3 pl-5 pr-4">
        <span className="font-mono text-xs font-medium text-accent">{row.supplierId}</span>
      </td>

      {/* Name & Email */}
      <td className="px-4 py-3">
        <p className="font-medium text-white">{row.name}</p>
        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
          <Mail className="size-3 shrink-0" strokeWidth={1.75} />
          {row.email}
        </span>
      </td>

      {/* Contact & Phone */}
      <td className="px-4 py-3">
        <p className="text-slate-300">{row.contactName}</p>
        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
          <Phone className="size-3 shrink-0" strokeWidth={1.75} />
          {row.phone}
        </span>
      </td>

      {/* City */}
      <td className="px-4 py-3 text-sm text-slate-300">{row.city}</td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor}`}>
          {row.category}
        </span>
      </td>

      {/* Payment terms */}
      <td className="px-4 py-3 text-xs text-slate-400">{row.paymentTerms}</td>

      {/* Lead time */}
      <td className="px-4 py-3 tabular-nums text-slate-400">{row.leadTimeDays}d</td>

      {/* Last order */}
      <td className="px-4 py-3 text-xs text-slate-400">{row.lastOrder}</td>

      {/* Outstanding */}
      <td className="px-4 py-3">
        <span className={`tabular-nums font-medium ${isHighOutstanding ? 'text-magenta' : 'text-slate-300'}`}>
          {formatPkr(row.outstandingPkr)}
        </span>
      </td>

      {/* Active SKUs */}
      <td className="px-4 py-3 tabular-nums text-slate-400">{row.activeSkus}</td>

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
