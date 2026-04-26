import { Bell, Menu, Search, SlidersHorizontal } from 'lucide-react'

type Props = {
  title: string
  subtitle?: string
  alertCount?: number
  onAlertsClick?: () => void
  /** Opens mobile navigation drawer */
  onMenuClick?: () => void
}

export function TopBar({
  title,
  subtitle,
  alertCount = 0,
  onAlertsClick,
  onMenuClick,
}: Props) {
  return (
    <header className="border-b border-white/10 bg-canvas/80 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-5">
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
            <button
              type="button"
              className="inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-accent/35 hover:text-white sm:px-4"
            >
              <SlidersHorizontal className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <span className="hidden sm:inline">Filters</span>
            </button>
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
