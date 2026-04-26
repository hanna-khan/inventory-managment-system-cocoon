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
    <article
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${ring} opacity-90 blur-2xl`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          ) : null}
        </div>
        <span
          className={`inline-flex rounded-xl p-2.5 ${
            accent === 'magenta'
              ? 'bg-magenta-dim text-magenta'
              : 'bg-accent-dim text-accent'
          }`}
        >
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      {trend ? (
        <p
          className={`relative mt-4 text-xs font-medium ${
            trend.positive ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {trend.label}
        </p>
      ) : null}
    </article>
  )
}
