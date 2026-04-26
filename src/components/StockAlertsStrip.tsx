import { useMemo } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Package,
  X,
} from 'lucide-react'
import type { AppAlert, AlertSeverity } from '../data/mockDashboard'

const severityStyle: Record<
  AlertSeverity,
  { bar: string; icon: string; label: string }
> = {
  critical: {
    bar: 'border-l-rose-500 bg-rose-500/10',
    icon: 'text-rose-400',
    label: 'Critical',
  },
  warning: {
    bar: 'border-l-amber-400 bg-amber-500/10',
    icon: 'text-amber-300',
    label: 'Warning',
  },
  info: {
    bar: 'border-l-sky-400 bg-sky-500/10',
    icon: 'text-sky-300',
    label: 'Info',
  },
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  if (severity === 'info') return <Info className="size-4 shrink-0" strokeWidth={2} />
  return <AlertTriangle className="size-4 shrink-0" strokeWidth={2} />
}

type Props = {
  alerts: AppAlert[]
  expanded: boolean
  onToggle: () => void
  onDismiss: (id: string) => void
  onGoTo?: (nav: NonNullable<AppAlert['targetNav']>) => void
}

export function StockAlertsStrip({
  alerts,
  expanded,
  onToggle,
  onDismiss,
  onGoTo,
}: Props) {
  const counts = useMemo(() => {
    let critical = 0
    let warning = 0
    let info = 0
    for (const a of alerts) {
      if (a.severity === 'critical') critical += 1
      else if (a.severity === 'warning') warning += 1
      else info += 1
    }
    return { critical, warning, info }
  }, [alerts])

  if (alerts.length === 0) return null

  return (
    <div className="border-b border-white/10 bg-surface-elevated/90 px-4 py-2 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-magenta-dim text-magenta">
            <Package className="size-4" strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              {alerts.length} active alert{alerts.length === 1 ? '' : 's'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {counts.critical > 0 ? `${counts.critical} critical` : null}
              {counts.critical > 0 && counts.warning > 0 ? ' · ' : ''}
              {counts.warning > 0 ? `${counts.warning} warning` : null}
              {(counts.critical > 0 || counts.warning > 0) && counts.info > 0 ? ' · ' : ''}
              {counts.info > 0 ? `${counts.info} info` : null}
              {counts.critical === 0 && counts.warning === 0 && counts.info === 0
                ? 'Stock & operations'
                : null}
            </p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-2 text-slate-400">
          <span className="hidden text-xs sm:inline">Details</span>
          {expanded ? (
            <ChevronUp className="size-4" strokeWidth={2} />
          ) : (
            <ChevronDown className="size-4" strokeWidth={2} />
          )}
        </span>
      </button>

      {expanded ? (
        <ul className="mt-2 space-y-2 pb-2">
          {alerts.map((a) => {
            const s = severityStyle[a.severity]
            return (
              <li
                key={a.id}
                className={`flex gap-3 rounded-xl border border-white/10 border-l-4 bg-canvas/60 p-3 pl-3 ${s.bar}`}
              >
                <span className={`mt-0.5 shrink-0 ${s.icon}`}>
                  <SeverityIcon severity={a.severity} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <div className="flex shrink-0 items-center gap-1">
                      {a.targetNav && onGoTo ? (
                        <button
                          type="button"
                          onClick={() => onGoTo(a.targetNav!)}
                          className="rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-accent transition hover:bg-accent-dim hover:text-white"
                        >
                          Open
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onDismiss(a.id)}
                        className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
                        aria-label={`Dismiss ${a.title}`}
                      >
                        <X className="size-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{a.message}</p>
                  {a.sku ? (
                    <p className="mt-1.5 font-mono text-[11px] text-accent/90">{a.sku}</p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
