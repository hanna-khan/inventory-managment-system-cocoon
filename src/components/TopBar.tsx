import { Bell, Search, SlidersHorizontal } from 'lucide-react'

type Props = { title: string; subtitle?: string }

export function TopBar({ title, subtitle }: Props) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-canvas/80 px-6 py-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative hidden min-w-[200px] sm:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder="Search SKU, order…"
            className="w-full rounded-xl border border-white/10 bg-surface py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none ring-accent/40 focus:ring-2"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-accent/35 hover:text-white"
        >
          <SlidersHorizontal className="size-4" strokeWidth={1.75} />
          Filters
        </button>
        <button
          type="button"
          className="relative inline-flex rounded-xl border border-white/10 bg-surface p-2 text-slate-300 transition hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-magenta ring-2 ring-surface" />
        </button>
        <div
          className="size-10 rounded-full bg-gradient-to-br from-accent to-cyan-600 ring-2 ring-white/10"
          title="Profile"
          role="img"
          aria-label="User"
        />
      </div>
    </header>
  )
}
