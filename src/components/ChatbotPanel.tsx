import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  ChevronDown,
  MessageSquare,
  Package,
  Send,
  ShoppingCart,
  X,
} from 'lucide-react'
import { stockRows } from '../data/mockDashboard'

// ─── Types ───────────────────────────────────────────────────────────────────

type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  text: string
  ts: Date
}

type Tab = 'chat' | 'orders' | 'inventory'

// ─── Simple keyword chatbot ───────────────────────────────────────────────────

function getBotReply(input: string): string {
  const q = input.toLowerCase().trim()

  if (/\b(hi|hello|hey|salaam)\b/.test(q))
    return "Hello! I'm your Cocoon assistant. Ask me about inventory levels, orders, or SKU status."

  if (/low.?stock|reorder|critical/.test(q)) {
    const critical = stockRows.filter((r) => r.status === 'critical')
    const low = stockRows.filter((r) => r.status === 'low')
    if (critical.length === 0 && low.length === 0)
      return 'Great news — no stock alerts at the moment!'
    const lines = [
      critical.length > 0
        ? `🔴 Critical (${critical.length}): ${critical.map((r) => r.product).join(', ')}`
        : null,
      low.length > 0
        ? `🟡 Low (${low.length}): ${low.map((r) => r.product).join(', ')}`
        : null,
    ]
      .filter(Boolean)
      .join('\n')
    return `Current stock alerts:\n${lines}`
  }

  if (/inventor(y|ies)|stock|sku/.test(q)) {
    const total = stockRows.length
    const ok = stockRows.filter((r) => r.status === 'ok').length
    return `You have ${total} SKUs tracked. ${ok} are healthy, ${stockRows.filter((r) => r.status === 'low').length} are low, and ${stockRows.filter((r) => r.status === 'critical').length} are critical.`
  }

  if (/order(s)?|fulfil|ship/.test(q))
    return 'Navigate to the Orders page for a full breakdown by channel, courier, and fulfillment status.'

  if (/forecast|eoq|reorder point|demand/.test(q))
    return 'The Forecast page provides EOQ calculations and demand projections. Check it out in the sidebar.'

  if (/revenue|sale(s)?|pkr/.test(q))
    return 'Period revenue is PKR 19.50M for the sample window. Open the Dashboard for the full sales trend chart.'

  if (/help|what can you|command/.test(q))
    return 'I can answer questions about:\n• Stock levels & alerts\n• Order status\n• Forecast & EOQ\n• Revenue & KPIs\n\nJust ask in plain English!'

  return "I'm not sure about that. Try asking about stock levels, orders, revenue, or forecasting."
}

// ─── Order Form ───────────────────────────────────────────────────────────────

type OrderFormData = {
  product: string
  sku: string
  quantity: string
  supplier: string
  deliveryDate: string
  notes: string
}

const EMPTY_ORDER: OrderFormData = {
  product: '',
  sku: '',
  quantity: '',
  supplier: '',
  deliveryDate: '',
  notes: '',
}

function OrderForm() {
  const [form, setForm] = useState<OrderFormData>(EMPTY_ORDER)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof OrderFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm(EMPTY_ORDER)
    }, 2200)
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-dim text-accent">
          <ShoppingCart className="size-7" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-semibold text-white">Order created!</p>
        <p className="text-xs text-slate-500">Your purchase order has been queued.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-3">
      <Field label="Product name" required>
        <input
          value={form.product}
          onChange={set('product')}
          placeholder="e.g. Gulaab 2-Piece"
          required
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU">
          <input
            value={form.sku}
            onChange={set('sku')}
            placeholder="e.g. FPS2610011-4"
            className={inputCls}
          />
        </Field>
        <Field label="Quantity" required>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={set('quantity')}
            placeholder="Units"
            required
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Supplier">
        <input
          value={form.supplier}
          onChange={set('supplier')}
          placeholder="Supplier name"
          className={inputCls}
        />
      </Field>

      <Field label="Expected delivery">
        <input
          type="date"
          value={form.deliveryDate}
          onChange={set('deliveryDate')}
          className={inputCls}
        />
      </Field>

      <Field label="Notes">
        <textarea
          rows={2}
          value={form.notes}
          onChange={set('notes')}
          placeholder="Any special instructions…"
          className={`${inputCls} resize-none`}
        />
      </Field>

      <button type="submit" className={primaryBtn}>
        <ShoppingCart className="size-4 shrink-0" strokeWidth={1.75} />
        Create order
      </button>
    </form>
  )
}

// ─── Inventory Form ───────────────────────────────────────────────────────────

type InvFormData = {
  product: string
  sku: string
  category: string
  onHand: string
  reorderPoint: string
  location: string
}

const EMPTY_INV: InvFormData = {
  product: '',
  sku: '',
  category: '',
  onHand: '',
  reorderPoint: '',
  location: '',
}

const CATEGORIES = ['Unstitched', 'Pret', 'Lawn', 'Festive', 'Other']

function InventoryForm() {
  const [form, setForm] = useState<InvFormData>(EMPTY_INV)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof InvFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm(EMPTY_INV)
    }, 2200)
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-dim text-accent">
          <Package className="size-7" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-semibold text-white">Item added!</p>
        <p className="text-xs text-slate-500">Inventory record has been saved.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-3">
      <Field label="Product name" required>
        <input
          value={form.product}
          onChange={set('product')}
          placeholder="e.g. Eclipse Garden"
          required
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU" required>
          <input
            value={form.sku}
            onChange={set('sku')}
            placeholder="SKU code"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={set('category')} className={inputCls}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="On hand (units)" required>
          <input
            type="number"
            min={0}
            value={form.onHand}
            onChange={set('onHand')}
            placeholder="0"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Reorder point">
          <input
            type="number"
            min={0}
            value={form.reorderPoint}
            onChange={set('reorderPoint')}
            placeholder="0"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Storage location">
        <input
          value={form.location}
          onChange={set('location')}
          placeholder="e.g. Warehouse A, Shelf 3"
          className={inputCls}
        />
      </Field>

      <button type="submit" className={primaryBtn}>
        <Package className="size-4 shrink-0" strokeWidth={1.75} />
        Add inventory item
      </button>
    </form>
  )
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-white/10 bg-surface-elevated px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none ring-accent/40 focus:ring-2 transition [color-scheme:dark]'

const primaryBtn =
  'mt-1 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 active:scale-[0.98]'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400">
        {label}
        {required && <span className="ml-0.5 text-magenta">*</span>}
      </label>
      {children}
    </div>
  )
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: "Hi! I'm your Cocoon assistant. Ask me about inventory levels, orders, revenue, or forecasting.",
  ts: new Date(),
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = () => {
    const text = input.trim()
    if (!text || thinking) return

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, ts: new Date() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)

    setTimeout(
      () => {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: getBotReply(text),
          ts: new Date(),
        }
        setMessages((m) => [...m, botMsg])
        setThinking(false)
      },
      420 + Math.random() * 300,
    )
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Message list */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'bot' && (
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-dim text-accent">
                <Bot className="size-4" strokeWidth={1.75} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'rounded-tr-sm bg-accent text-canvas'
                  : 'rounded-tl-sm bg-surface-elevated text-slate-200'
              }`}
            >
              {msg.text}
              <p
                className={`mt-1 text-[10px] ${
                  msg.role === 'user' ? 'text-canvas/60 text-right' : 'text-slate-600'
                }`}
              >
                {formatTime(msg.ts)}
              </p>
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-2">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-dim text-accent">
              <Bot className="size-4" strokeWidth={1.75} />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-surface-elevated px-4 py-3">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-slate-500"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-3 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface-elevated px-3 py-2 ring-accent/40 focus-within:ring-2 transition">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about inventory, orders…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || thinking}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent text-canvas transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Package },
]

type PanelProps = {
  open: boolean
  onClose: () => void
}

export function ChatbotPanel({ open, onClose }: PanelProps) {
  const [tab, setTab] = useState<Tab>('chat')

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Cocoon assistant"
        aria-modal="true"
        className={`fixed bottom-0 right-0 z-50 flex flex-col
          w-full sm:w-[390px]
          h-[min(600px,90dvh)]
          rounded-tl-2xl rounded-tr-2xl sm:rounded-2xl sm:bottom-20 sm:right-4
          border border-white/10 bg-surface shadow-2xl
          transition-all duration-300 ease-out
          ${open ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent">
            <Bot className="size-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Cocoon Assistant</p>
            <p className="text-xs text-slate-500">AI-powered inventory help</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close assistant"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 pt-2 pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 rounded-t-xl px-3 py-2 text-xs font-medium transition border-b-2
                ${
                  tab === id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
              <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {tab === 'chat' && <ChatTab />}
          {tab === 'orders' && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  New Purchase Order
                </p>
              </div>
              <OrderForm />
            </div>
          )}
          {tab === 'inventory' && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Add Inventory Item
                </p>
              </div>
              <InventoryForm />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Floating Action Button ───────────────────────────────────────────────────

type FabProps = {
  open: boolean
  onClick: () => void
  unread?: number
}

export function ChatbotFab({ open, onClick, unread = 0 }: FabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close assistant' : 'Open assistant'}
      className={`fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full shadow-lg
        transition-all duration-200 active:scale-95
        ${open ? 'bg-surface-elevated border border-white/10 text-slate-300 hover:text-white' : 'bg-accent text-canvas hover:brightness-110'}`}
    >
      {open ? (
        <ChevronDown className="size-5" strokeWidth={2} />
      ) : (
        <Bot className="size-6" strokeWidth={1.75} />
      )}
      {!open && unread > 0 && (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-magenta px-1 text-[10px] font-bold leading-none text-white ring-2 ring-canvas">
          {unread}
        </span>
      )}
    </button>
  )
}
