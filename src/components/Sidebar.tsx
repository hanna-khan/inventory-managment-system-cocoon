import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sparkles,
  Warehouse,
  X,
} from 'lucide-react'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Warehouse },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'forecast', label: 'Forecast', icon: Sparkles },
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
    <nav className="flex flex-1 flex-col gap-1 p-2 sm:p-3" aria-label="Main">
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              onSelect(id)
              if (closeOnPick) onMobileClose()
            }}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition active:bg-white/15 ${
              isActive
                ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Icon className="size-4 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
            {label}
          </button>
        )
      })}
    </nav>
  )

  const footer = (
    <div className="border-t border-white/10 p-3 sm:p-4">
      <button
        type="button"
        className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-white/10 bg-surface-elevated px-3 py-2 text-left text-sm text-slate-300 transition hover:border-accent/40 hover:text-white"
      >
        <Package className="size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
        SKU catalog
      </button>
    </div>
  )

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
