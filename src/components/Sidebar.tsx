import {
  LayoutDashboard,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
  Warehouse,
  X,
} from 'lucide-react'
import { skuCatalogRows } from '../data/mockDashboard'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { id: 'sku', label: 'SKU Catalog', icon: Tag, badge: skuCatalogRows.length },
      { id: 'suppliers', label: 'Suppliers', icon: Truck },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'inventory', label: 'Inventory', icon: Warehouse },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'forecast', label: 'Forecast', icon: Sparkles },
    ],
  },
] as const

type Props = {
  active: string
  onSelect: (id: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ active, onSelect, mobileOpen, onMobileClose }: Props) {
  const brand = (
    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-lg font-bold text-accent">
        C
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">Cocoon</p>
        <p className="truncate text-xs text-slate-500">Salman Industries</p>
      </div>
      <button
        type="button"
        onClick={onMobileClose}
        className="ml-auto rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        aria-label="Close menu"
      >
        <X className="size-5" strokeWidth={2} />
      </button>
    </div>
  )

  const nav = (closeOnPick: boolean) => (
    <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-2 py-3 sm:p-3" aria-label="Main">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map(({ id, label, icon: Icon, ...rest }) => {
              const badge = 'badge' in rest ? (rest as { badge?: number }).badge : undefined
              const isActive = active === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onSelect(id)
                    if (closeOnPick) onMobileClose()
                  }}
                  className={`flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition active:bg-white/15 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className="size-4 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
                  <span className="flex-1 truncate">{label}</span>
                  {badge !== undefined && (
                    <span className="rounded-full bg-accent-dim px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-accent">
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  const footer = null

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-surface/80 backdrop-blur-md lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-lg font-bold text-accent">
            C
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Cocoon</p>
            <p className="truncate text-xs text-slate-500">Salman Industries</p>
          </div>
        </div>
        {nav(false)}
        {footer}
      </aside>

      {/* Mobile backdrop */}
      <div
        role="presentation"
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onMobileClose}
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] max-w-full flex-col border-r border-white/10 bg-surface shadow-2xl transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        {brand}
        {nav(true)}
        {footer}
      </aside>
    </>
  )
}
