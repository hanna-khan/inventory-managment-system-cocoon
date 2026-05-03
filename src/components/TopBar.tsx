import { useEffect, useRef, useState } from 'react'
import { Bell, Menu, Search, SlidersHorizontal, X } from 'lucide-react'

type Props = {
  title: string
  subtitle?: string
  alertCount?: number
  onAlertsClick?: () => void
  /** Opens mobile navigation drawer */
  onMenuClick?: () => void
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-surface-elevated px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none ring-accent/40 focus:ring-2 transition [color-scheme:dark]'

type FilterState = {
  dateFrom: string
  dateTo: string
  category: string
  status: string
  city: string
}

const EMPTY_FILTERS: FilterState = { dateFrom: '', dateTo: '', category: '', status: '', city: '' }

function FiltersPanel({ onClose }: { onClose: () => void }) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const set = (k: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }))
  const hasAny = Object.values(filters).some(Boolean)

  return (
    <div className="absolute right-0 top-full z-[200] mt-2 w-[min(480px,96vw)] rounded-2xl border border-white/10 bg-surface p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Filters</p>
        {hasAny && (
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-xs text-slate-500 transition hover:text-magenta"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Date range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Date from</label>
          <input type="date" value={filters.dateFrom} onChange={set('dateFrom')} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Date to</label>
          <input type="date" value={filters.dateTo} onChange={set('dateTo')} className={inputCls} />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Category</label>
          <select value={filters.category} onChange={set('category')} className={inputCls}>
            <option value="">All categories</option>
            {['Pret', 'Lawn', 'Unstitched', 'Festive'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Status</label>
          <select value={filters.status} onChange={set('status')} className={inputCls}>
            <option value="">All statuses</option>
            {['Active', 'Low Stock', 'Critical', 'Fulfilled', 'Unfulfilled'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* City */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">City</label>
          <input
            type="text"
            value={filters.city}
            onChange={set('city')}
            placeholder="e.g. Karachi, Lahore…"
            className={inputCls}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2 text-sm font-semibold text-canvas transition hover:brightness-110"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

export function TopBar({
  title,
  subtitle,
  alertCount = 0,
  onAlertsClick,
  onMenuClick,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!filtersOpen) return
    const handler = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [filtersOpen])
  return (
    <header className="relative z-30 border-b border-white/10 bg-canvas/80 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-3">
          {onMenuClick ? (
            <button
              type="button"
              onClick={onMenuClick}
              className="shrink-0 rounded-xl p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" strokeWidth={2} />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-500 sm:text-sm sm:leading-normal">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-[220px] sm:flex-none md:min-w-[200px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search SKU, order…"
              className="min-h-10 w-full rounded-xl border border-white/10 bg-surface py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none ring-accent/40 focus:ring-2"
            />
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <div ref={filtersRef} className="relative">
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                className={`inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition sm:px-4
                  ${filtersOpen
                    ? 'border-accent/50 bg-accent-dim text-accent'
                    : 'border-white/10 bg-surface text-slate-200 hover:border-accent/35 hover:text-white'}`}
              >
                <SlidersHorizontal className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                <span className="hidden sm:inline">Filters</span>
              </button>
              {filtersOpen && <FiltersPanel onClose={() => setFiltersOpen(false)} />}
            </div>
            <button
              type="button"
              onClick={onAlertsClick}
              disabled={!onAlertsClick}
              className="relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-surface p-2 text-slate-300 transition hover:border-accent/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={
                alertCount > 0
                  ? `Alerts: ${alertCount} active. Show alert panel.`
                  : 'No active alerts'
              }
            >
              <Bell className="size-5" strokeWidth={1.75} />
              {alertCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-magenta px-1 text-[10px] font-bold leading-none text-white ring-2 ring-surface">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              ) : null}
            </button>
            <div
              className="size-10 shrink-0 rounded-full bg-gradient-to-br from-accent to-cyan-600 ring-2 ring-white/10"
              title="Profile"
              role="img"
              aria-label="User"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
