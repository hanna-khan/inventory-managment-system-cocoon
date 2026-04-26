export const kpiSummary = {
  inventoryValuePkr: 12_450_000,
  skuCount: 186,
  ordersPeriod: 4020,
  revenuePkr: 19_500_000,
  turnoverRatio: 4.2,
  stockOutRatePct: 3.1,
  deadStockPkr: 890_000,
  lowStockCount: 14,
}

export type DailyPoint = { date: string; revenue: number; orders: number }

export const dailySales: DailyPoint[] = [
  { date: 'Apr 1', revenue: 420_000, orders: 118 },
  { date: 'Apr 3', revenue: 380_000, orders: 102 },
  { date: 'Apr 5', revenue: 510_000, orders: 135 },
  { date: 'Apr 7', revenue: 465_000, orders: 121 },
  { date: 'Apr 9', revenue: 620_000, orders: 158 },
  { date: 'Apr 11', revenue: 540_000, orders: 142 },
  { date: 'Apr 13', revenue: 710_000, orders: 176 },
  { date: 'Apr 15', revenue: 590_000, orders: 151 },
  { date: 'Apr 17', revenue: 680_000, orders: 168 },
  { date: 'Apr 19', revenue: 720_000, orders: 174 },
]

export const topSkus = [
  { name: 'Lemon Tart', orders: 222 },
  { name: 'Petal & Wings', orders: 196 },
  { name: 'Gulaab 2-Piece', orders: 178 },
  { name: 'Eclipse Garden', orders: 154 },
  { name: 'Mauve 2-Piece', orders: 141 },
]

export const categorySplit = [
  { name: 'Unstitched', value: 38 },
  { name: 'Pret', value: 32 },
  { name: 'Lawn', value: 18 },
  { name: 'Festive', value: 12 },
]

export type StockRow = {
  sku: string
  product: string
  category: string
  onHand: number
  reorder: number
  daysCover: number
  status: 'ok' | 'low' | 'critical'
}

export const stockRows: StockRow[] = [
  {
    sku: 'FPS2610011-4',
    product: 'Gulaab 2-Piece',
    category: 'Pret',
    onHand: 24,
    reorder: 40,
    daysCover: 9,
    status: 'low',
  },
  {
    sku: 'MPW251010-1',
    product: 'Mauve | 2-Piece',
    category: 'Pret',
    onHand: 8,
    reorder: 30,
    daysCover: 4,
    status: 'critical',
  },
  {
    sku: 'SKD-000338',
    product: 'Crimson',
    category: 'Lawn',
    onHand: 62,
    reorder: 35,
    daysCover: 28,
    status: 'ok',
  },
  {
    sku: 'OPS252003-3',
    product: 'Fondant | 2 Piece',
    category: 'Festive',
    onHand: 15,
    reorder: 25,
    daysCover: 11,
    status: 'low',
  },
  {
    sku: 'MPKW252021-2',
    product: 'Eclipse Garden',
    category: 'Unstitched',
    onHand: 48,
    reorder: 28,
    daysCover: 22,
    status: 'ok',
  },
]

export type AlertSeverity = 'critical' | 'warning' | 'info'

export type AppAlert = {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  sku?: string
  /** Suggested nav target for “fix it” */
  targetNav?: 'inventory' | 'orders' | 'forecast'
}

/** Derive low / critical stock alerts from `stockRows`. */
export function buildStockAlerts(rows: StockRow[]): AppAlert[] {
  const list: AppAlert[] = []
  for (const r of rows) {
    if (r.status === 'critical') {
      list.push({
        id: `stock-critical-${r.sku}`,
        severity: 'critical',
        title: 'Reorder now — critical stock',
        message: `${r.product} (${r.sku}): ${r.onHand} on hand vs reorder ${r.reorder}. ~${r.daysCover} days cover.`,
        sku: r.sku,
        targetNav: 'inventory',
      })
    } else if (r.status === 'low') {
      list.push({
        id: `stock-low-${r.sku}`,
        severity: 'warning',
        title: 'Low stock',
        message: `${r.product} (${r.sku}): ${r.onHand} units left (reorder point ${r.reorder}).`,
        sku: r.sku,
        targetNav: 'inventory',
      })
    }
  }
  return list
}

/** Ops / policy alerts (demo) — extend or replace with API rules */
export const systemAlerts: AppAlert[] = [
  {
    id: 'unfulfilled-queue',
    severity: 'warning',
    title: 'Unfulfilled orders backlog',
    message:
      'Several COD orders still unfulfilled past 48h. Check cutting queue and courier handoff.',
    targetNav: 'orders',
  },
  {
    id: 'dead-stock-watch',
    severity: 'info',
    title: 'Dead stock review',
    message: `Approx PKR ${kpiSummary.deadStockPkr.toLocaleString('en-PK')} tied in slow movers. Consider markdown or bundle.`,
    targetNav: 'forecast',
  },
]

/** Units in stock by age bucket (demo) — replace with warehouse snapshot */
export const agingByCategory = [
  { name: 'Pret', b0_30: 820, b31_60: 310, b61_90: 120, b90p: 45 },
  { name: 'Lawn', b0_30: 540, b31_60: 180, b61_90: 90, b90p: 60 },
  { name: 'Unstitched', b0_30: 620, b31_60: 240, b61_90: 55, b90p: 30 },
  { name: 'Festive', b0_30: 210, b31_60: 95, b61_90: 40, b90p: 22 },
]

export type OrderRow = {
  id: string
  created: string
  city: string
  lineItems: number
  totalPkr: number
  payment: 'COD' | 'Online paid' | 'Pending'
  fulfillment: 'Fulfilled' | 'Unfulfilled' | 'Partial'
}

export const orderRows: OrderRow[] = [
  {
    id: 'CO-39091',
    created: '2026-04-10',
    city: 'Sialkot',
    lineItems: 2,
    totalPkr: 11990,
    payment: 'COD',
    fulfillment: 'Unfulfilled',
  },
  {
    id: 'CO-39092',
    created: '2026-04-10',
    city: 'Karachi',
    lineItems: 2,
    totalPkr: 11500,
    payment: 'COD',
    fulfillment: 'Unfulfilled',
  },
  {
    id: 'CO-39093',
    created: '2026-04-10',
    city: 'Islamabad',
    lineItems: 1,
    totalPkr: 7600,
    payment: 'COD',
    fulfillment: 'Fulfilled',
  },
  {
    id: 'CO-39094',
    created: '2026-04-10',
    city: 'Hyderabad',
    lineItems: 1,
    totalPkr: 6090,
    payment: 'COD',
    fulfillment: 'Fulfilled',
  },
  {
    id: 'CO-39095',
    created: '2026-04-10',
    city: 'Karachi',
    lineItems: 1,
    totalPkr: 6500,
    payment: 'COD',
    fulfillment: 'Unfulfilled',
  },
  {
    id: 'CO-39096',
    created: '2026-04-11',
    city: 'Lahore',
    lineItems: 3,
    totalPkr: 18900,
    payment: 'Online paid',
    fulfillment: 'Fulfilled',
  },
  {
    id: 'CO-39097',
    created: '2026-04-11',
    city: 'Rawalpindi',
    lineItems: 1,
    totalPkr: 5500,
    payment: 'Pending',
    fulfillment: 'Unfulfilled',
  },
]

export const courierMix = [
  { name: 'TCS', orders: 613 },
  { name: 'Mudassir', orders: 266 },
  { name: 'Asad', orders: 197 },
  { name: 'Postex', orders: 112 },
  { name: 'Skynet', orders: 91 },
]

export type ForecastRow = {
  sku: string
  product: string
  avgDailyUnits: number
  forecast30d: number
  eoq: number
  safetyStock: number
  suggestOrderQty: number
  reorderBy: string
}

export const forecastRows: ForecastRow[] = [
  {
    sku: 'MPW251010-1',
    product: 'Mauve | 2-Piece',
    avgDailyUnits: 3.8,
    forecast30d: 114,
    eoq: 95,
    safetyStock: 28,
    suggestOrderQty: 120,
    reorderBy: '2026-04-28',
  },
  {
    sku: 'FPS2610011-4',
    product: 'Gulaab 2-Piece',
    avgDailyUnits: 4.2,
    forecast30d: 126,
    eoq: 110,
    safetyStock: 32,
    suggestOrderQty: 95,
    reorderBy: '2026-05-01',
  },
  {
    sku: 'SKD-000338',
    product: 'Crimson',
    avgDailyUnits: 2.1,
    forecast30d: 63,
    eoq: 72,
    safetyStock: 18,
    suggestOrderQty: 0,
    reorderBy: '—',
  },
  {
    sku: 'OPS252003-3',
    product: 'Fondant | 2 Piece',
    avgDailyUnits: 2.6,
    forecast30d: 78,
    eoq: 88,
    safetyStock: 22,
    suggestOrderQty: 70,
    reorderBy: '2026-05-03',
  },
  {
    sku: 'MPKW252021-2',
    product: 'Eclipse Garden',
    avgDailyUnits: 3.0,
    forecast30d: 90,
    eoq: 102,
    safetyStock: 24,
    suggestOrderQty: 45,
    reorderBy: '2026-05-08',
  },
]
