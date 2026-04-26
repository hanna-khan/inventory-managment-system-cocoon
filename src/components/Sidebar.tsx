import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sparkles,
  Warehouse,
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
}

export function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-white/10 bg-surface/80 backdrop-blur-md">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent-dim text-lg font-bold text-accent">
          C
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Cocoon</p>
          <p className="text-xs text-slate-500">Salman Industries</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon className="size-4 shrink-0 opacity-90" strokeWidth={1.75} />
              {label}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-surface-elevated px-3 py-2 text-left text-sm text-slate-300 transition hover:border-accent/40 hover:text-white"
        >
          <Package className="size-4 text-accent" strokeWidth={1.75} />
          SKU catalog
        </button>
      </div>
    </aside>
  )
}
