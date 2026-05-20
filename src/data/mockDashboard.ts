export const kpiSummary = {
  inventoryValuePkr: 18_136_630,      // estimated from EOQ × unit cost across A+B items
  skuCount: 1117,                      // actual unique items sold in 12 months
  ordersPeriod: 1966,                  // Aug 2025 unique orders (4020 was line items, mislabeled)
  revenuePkr: 17_110_300,              // actual Aug 2025 revenue
  turnoverRatio: 4.8,                  // computed from annual COGS / avg inventory
  stockOutRatePct: 1.7,                // actual cancellation rate from 12-mo data
  deadStockPkr: 1_129_980,             // estimated from C-class slow movers
  lowStockCount: 14,
}

export type DailyPoint = { date: string; revenue: number; orders: number }

export const dailySales: DailyPoint[] = [
  { date: 'Aug 1',  revenue: 483_800, orders: 56 },
  { date: 'Aug 4',  revenue: 735_000, orders: 69 },
  { date: 'Aug 7',  revenue: 398_500, orders: 44 },
  { date: 'Aug 10', revenue: 968_500, orders: 113 },
  { date: 'Aug 13', revenue: 499_500, orders: 66 },
  { date: 'Aug 16', revenue: 502_000, orders: 56 },
  { date: 'Aug 19', revenue: 507_500, orders: 54 },
  { date: 'Aug 22', revenue: 656_500, orders: 72 },
  { date: 'Aug 25', revenue: 617_000, orders: 60 },
  { date: 'Aug 28', revenue: 580_000, orders: 69 },
]

export const topSkus = [
  { name: 'Pink Opal', orders: 1045 },
  { name: 'Summer Ombre', orders: 993 },
  { name: 'Ginger Gold', orders: 889 },
  { name: 'Bloom Ombre Kaftan', orders: 779 },
  { name: 'Jade', orders: 699 },
]

export const categorySplit = [
  { name: 'Single Pieces', value: 68 },
  { name: 'Dupatta', value: 16 },
  { name: 'Kaftan', value: 16 },
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
    sku: 'CCN-SO-001',
    product: 'Summer Ombre',
    category: 'Single Pieces',
    onHand: 142,
    reorder: 167,
    daysCover: 16,
    status: 'low',
  },
  {
    sku: 'CCN-PO-002',
    product: 'Pink Opal',
    category: 'Single Pieces',
    onHand: 89,
    reorder: 177,
    daysCover: 13,
    status: 'critical',
  },
  {
    sku: 'CCN-BOK-003',
    product: 'Bloom Ombre Kaftan',
    category: 'Kaftan',
    onHand: 215,
    reorder: 134,
    daysCover: 29,
    status: 'ok',
  },
  {
    sku: 'CCN-GG-004',
    product: 'Ginger Gold',
    category: 'Single Pieces',
    onHand: 98,
    reorder: 141,
    daysCover: 14,
    status: 'low',
  },
  {
    sku: 'CCN-JD-005',
    product: 'Jade',
    category: 'Single Pieces',
    onHand: 124,
    reorder: 96,
    daysCover: 23,
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
  { name: 'TCS', orders: 618 },
  { name: 'Mudassir', orders: 266 },
  { name: 'Asad', orders: 200 },
  { name: 'Skynet', orders: 91 },
  { name: 'Postex', orders: 27 },
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
    sku: 'CCN-PO-002',
    product: 'Pink Opal',
    avgDailyUnits: 7.0,
    forecast30d: 210,
    eoq: 107,
    safetyStock: 79,
    suggestOrderQty: 120,
    reorderBy: '2026-05-08',
  },
  {
    sku: 'CCN-SO-001',
    product: 'Summer Ombre',
    avgDailyUnits: 8.9,
    forecast30d: 267,
    eoq: 100,
    safetyStock: 42,
    suggestOrderQty: 110,
    reorderBy: '2026-05-04',
  },
  {
    sku: 'CCN-BOK-003',
    product: 'Bloom Ombre Kaftan',
    avgDailyUnits: 7.4,
    forecast30d: 223,
    eoq: 91,
    safetyStock: 30,
    suggestOrderQty: 0,
    reorderBy: '—',
  },
  {
    sku: 'CCN-GG-004',
    product: 'Ginger Gold',
    avgDailyUnits: 6.8,
    forecast30d: 205,
    eoq: 108,
    safetyStock: 45,
    suggestOrderQty: 100,
    reorderBy: '2026-05-12',
  },
  {
    sku: 'CCN-JD-005',
    product: 'Jade',
    avgDailyUnits: 5.3,
    forecast30d: 160,
    eoq: 96,
    safetyStock: 21,
    suggestOrderQty: 0,
    reorderBy: '—',
  },
]

// ─── SKU Catalog ─────────────────────────────────────────────────────────────

export type SkuCatalogRow = {
  sku: string
  product: string
  category: string
  supplier: string
  unitCost: number
  retailPrice: number
  margin: number
  onHand: number
  reorderPoint: number
  leadTimeDays: number
  lastSold: string
  status: 'active' | 'low' | 'critical'
}

export const skuCatalogRows: SkuCatalogRow[] = [
  { sku: 'FPS2610011-4', product: 'Gulaab 2-Piece',      category: 'Pret',       supplier: 'Karachi Emb. Co.',   unitCost: 1_800, retailPrice: 3_200, margin: 44, onHand: 24, reorderPoint: 36, leadTimeDays: 14, lastSold: 'Apr 24', status: 'low' },
  { sku: 'MPW251010-1',  product: 'Mauve | 2-Piece',     category: 'Pret',       supplier: 'Al-Rahim Textiles',  unitCost: 1_600, retailPrice: 2_900, margin: 45, onHand: 8,  reorderPoint: 25, leadTimeDays: 10, lastSold: 'Apr 26', status: 'critical' },
  { sku: 'SKD-000338',   product: 'Crimson',             category: 'Lawn',       supplier: 'Faisal Fabrics',     unitCost: 950,   retailPrice: 1_800, margin: 47, onHand: 62, reorderPoint: 26, leadTimeDays: 7,  lastSold: 'Apr 26', status: 'active' },
  { sku: 'OPS252003-3',  product: 'Fondant | 2 Piece',   category: 'Festive',    supplier: 'Lahore Prints',      unitCost: 2_200, retailPrice: 4_100, margin: 46, onHand: 15, reorderPoint: 16, leadTimeDays: 21, lastSold: 'Apr 20', status: 'low' },
  { sku: 'MPKW252021-2', product: 'Eclipse Garden',      category: 'Unstitched', supplier: 'Faisal Fabrics',     unitCost: 1_100, retailPrice: 2_100, margin: 48, onHand: 48, reorderPoint: 15, leadTimeDays: 7,  lastSold: 'Apr 26', status: 'active' },
  { sku: 'SKD-000412',   product: 'Lemon Tart',          category: 'Lawn',       supplier: 'Al-Rahim Textiles',  unitCost: 900,   retailPrice: 1_650, margin: 45, onHand: 5,  reorderPoint: 20, leadTimeDays: 7,  lastSold: 'Apr 26', status: 'critical' },
  { sku: 'UNS254018-1',  product: 'Petal & Wings',       category: 'Unstitched', supplier: 'Faisal Fabrics',     unitCost: 1_050, retailPrice: 2_000, margin: 48, onHand: 33, reorderPoint: 15, leadTimeDays: 8,  lastSold: 'Apr 25', status: 'active' },
  { sku: 'PRE258044-2',  product: 'Khaddi Bloom',        category: 'Pret',       supplier: 'Karachi Emb. Co.',   unitCost: 1_950, retailPrice: 3_600, margin: 46, onHand: 19, reorderPoint: 26, leadTimeDays: 14, lastSold: 'Apr 22', status: 'low' },
  { sku: 'FES252109-3',  product: 'Rose Celebration',    category: 'Festive',    supplier: 'Lahore Prints',      unitCost: 2_400, retailPrice: 4_800, margin: 50, onHand: 41, reorderPoint: 12, leadTimeDays: 21, lastSold: 'Apr 15', status: 'active' },
  { sku: 'UNS256077-5',  product: 'Ivory Fields',        category: 'Unstitched', supplier: 'Al-Rahim Textiles',  unitCost: 800,   retailPrice: 1_500, margin: 47, onHand: 0,  reorderPoint: 25, leadTimeDays: 7,  lastSold: 'Mar 28', status: 'critical' },
  { sku: 'SKD-000501',   product: 'Indigo Mirage',       category: 'Lawn',       supplier: 'Faisal Fabrics',     unitCost: 1_000, retailPrice: 1_900, margin: 47, onHand: 71, reorderPoint: 20, leadTimeDays: 7,  lastSold: 'Apr 26', status: 'active' },
  { sku: 'PRE261033-1',  product: 'Midnight Garden',     category: 'Pret',       supplier: 'Karachi Emb. Co.',   unitCost: 2_100, retailPrice: 3_900, margin: 46, onHand: 12, reorderPoint: 30, leadTimeDays: 14, lastSold: 'Apr 19', status: 'low' },
]

// ─── Suppliers ────────────────────────────────────────────────────────────────

export type SupplierRow = {
  supplierId: string
  name: string
  email: string
  contactName: string
  phone: string
  city: string
  category: string
  paymentTerms: string
  leadTimeDays: number
  lastOrder: string
  outstandingPkr: number
  activeSkus: number
}

export const supplierRows: SupplierRow[] = [
  { supplierId: 'SUP-001', name: 'Al-Rahim Textiles',    email: 'ahmed@alrahim.pk',   contactName: 'Ahmed Rahim',    phone: '0321-2345678', city: 'Karachi',    category: 'Fabric',       paymentTerms: 'Net 30',      leadTimeDays: 7,  lastOrder: 'Apr 22', outstandingPkr: 380_000, activeSkus: 4 },
  { supplierId: 'SUP-002', name: 'Faisal Fabrics',       email: 'faisal@fabrics.pk',  contactName: 'Faisal Mehmood', phone: '0333-9876345', city: 'Lahore',     category: 'Fabric',       paymentTerms: '50% Advance', leadTimeDays: 8,  lastOrder: 'Apr 20', outstandingPkr: 220_000, activeSkus: 3 },
  { supplierId: 'SUP-003', name: 'Karachi Emb. Co.',     email: 'info@kemb.pk',       contactName: 'Samina Raza',    phone: '0300-1112233', city: 'Karachi',    category: 'Embroidery',   paymentTerms: 'Advance',     leadTimeDays: 14, lastOrder: 'Apr 18', outstandingPkr: 510_000, activeSkus: 2 },
  { supplierId: 'SUP-004', name: 'Lahore Prints',        email: 'usman@lprints.pk',   contactName: 'Usman Malik',    phone: '0345-6667788', city: 'Lahore',     category: 'Printing',     paymentTerms: 'Net 15',      leadTimeDays: 21, lastOrder: 'Apr 10', outstandingPkr: 175_000, activeSkus: 2 },
  { supplierId: 'SUP-005', name: 'Zeenat Packaging',     email: 'z.pack@gmail.com',   contactName: 'Zeenat Hussain', phone: '0311-4445596', city: 'Karachi',    category: 'Packaging',    paymentTerms: 'Advance',     leadTimeDays: 5,  lastOrder: 'Apr 26', outstandingPkr: 42_000,  activeSkus: 6 },
  { supplierId: 'SUP-006', name: 'Premier Accessories',  email: 'bilal@primac.pk',    contactName: 'Bilal Khan',     phone: '0312-7778889', city: 'Faisalabad', category: 'Accessories',  paymentTerms: 'Net 30',      leadTimeDays: 12, lastOrder: 'Mar 30', outstandingPkr: 95_000,  activeSkus: 1 },
  { supplierId: 'SUP-007', name: 'Textile Hub Multan',   email: 'nadeem@texhub.pk',   contactName: 'Nadeem Baig',    phone: '0301-2223334', city: 'Multan',     category: 'Fabric',       paymentTerms: 'Net 45',      leadTimeDays: 18, lastOrder: 'Mar 15', outstandingPkr: 290_000, activeSkus: 1 },
  { supplierId: 'SUP-008', name: 'Creative Print Works', email: 'rabia@cpw.pk',       contactName: 'Rabia Shah',     phone: '0322-5556678', city: 'Karachi',    category: 'Printing',     paymentTerms: 'Net 30',      leadTimeDays: 10, lastOrder: 'Feb 28', outstandingPkr: 68_000,  activeSkus: 2 },
]
