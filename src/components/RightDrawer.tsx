import { useEffect } from 'react'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export function RightDrawer({ open, onClose, title, subtitle, icon, children }: Props) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200
          ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col
          border-l border-white/10 bg-surface shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start gap-3 border-b border-white/10 px-5 py-4">
          {icon && (
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </aside>
    </>
  )
}
