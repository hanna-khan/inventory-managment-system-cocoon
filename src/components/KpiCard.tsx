import type { LucideIcon } from 'lucide-react'

type Props = {
  title: string
  value: string
  hint?: string
  trend?: { label: string; positive: boolean }
  icon: LucideIcon
  accent?: 'cyan' | 'magenta'
}

export function KpiCard({
  title,
  value,
  hint,
  trend,
  icon: Icon,
  accent = 'cyan',
}: Props) {
  const ring =
    accent === 'magenta'
      ? 'from-magenta-dim to-transparent shadow-glow-pink'
      : 'from-accent-dim to-transparent shadow-glow-cyan'

  return (
    <article className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-surface p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-5">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${ring} opacity-90 blur-2xl`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-400 sm:text-sm">{title}</p>
          <p className="mt-1.5 break-words text-xl font-semibold tracking-tight text-white sm:mt-2 sm:text-2xl">
            {value}
          </p>
          {hint ? <p className="mt-1 line-clamp-2 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <span
          className={`inline-flex shrink-0 rounded-xl p-2 sm:p-2.5 ${
            accent === 'magenta'
              ? 'bg-magenta-dim text-magenta'
              : 'bg-accent-dim text-accent'
          }`}
        >
          <Icon className="size-[1.15rem] sm:size-5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      {trend ? (
        <p
          className={`relative mt-3 text-xs font-medium sm:mt-4 ${
            trend.positive ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {trend.label}
        </p>
      ) : null}
    </article>
  )
}
