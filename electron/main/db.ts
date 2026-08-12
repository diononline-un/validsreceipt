import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import { getArcteryxTemplate } from './arcteryx-template'
import type {
  Brand,
  BrandSelector,
  Receipt,
  ReceiptItem,
  NewBrand,
  NewReceiptData,
  ReceiptWithItems
} from '../../src/lib/types'

let db: Database.Database

export function getDbPath(): string {
  let dbDir: string
  if (app.isPackaged) {
    dbDir = app.getPath('userData')
  } else {
    dbDir = path.join(app.getAppPath(), 'data')
  }
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  return path.join(dbDir, 'validsreceipt.db')
}

export function initDatabase(): void {
  const dbPath = getDbPath()
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  runMigrations()
}

function runMigrations(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      logo_path TEXT,
      template_html TEXT DEFAULT '',
      template_css TEXT DEFAULT '',
      website_url TEXT DEFAULT '',
      vat_id TEXT DEFAULT '',
      tax_rate REAL DEFAULT 19.0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS brand_selectors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      url_pattern TEXT NOT NULL,
      product_name_sel TEXT DEFAULT '',
      product_price_sel TEXT DEFAULT '',
      product_image_sel TEXT DEFAULT '',
      product_options_sel TEXT DEFAULT '{}',
      last_validated TEXT,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      receipt_number TEXT NOT NULL,
      order_number TEXT NOT NULL,
      date TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_city TEXT NOT NULL,
      customer_zip TEXT NOT NULL,
      customer_country TEXT DEFAULT 'DE',
      subtotal REAL NOT NULL,
      shipping REAL DEFAULT 0,
      tax_rate REAL DEFAULT 19.0,
      tax_amount REAL NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT '',
      currency TEXT DEFAULT 'EUR',
      html_content TEXT DEFAULT '',
      screenshot_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipt_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT,
      size TEXT,
      quantity INTEGER DEFAULT 1,
      unit_price REAL NOT NULL,
      line_total REAL NOT NULL,
      image_url TEXT,
      image_local_path TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipt_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL UNIQUE,
      prefix TEXT NOT NULL DEFAULT '',
      next_number INTEGER DEFAULT 1000,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL UNIQUE,
      prefix TEXT NOT NULL DEFAULT '',
      next_number INTEGER DEFAULT 1000000,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );
  `)
}

// --- BRANDS ---

export function getAllBrands(): Brand[] {
  return db.prepare('SELECT * FROM brands ORDER BY name').all() as Brand[]
}

export function getBrand(id: number): Brand | undefined {
  return db.prepare('SELECT * FROM brands WHERE id = ?').get(id) as Brand | undefined
}

export function createBrand(data: NewBrand): Brand {
  const stmt = db.prepare(`
    INSERT INTO brands (name, logo_path, template_html, template_css, website_url, vat_id, tax_rate)
    VALUES (@name, @logo_path, @template_html, @template_css, @website_url, @vat_id, @tax_rate)
  `)
  const info = stmt.run({
    name: data.name,
    logo_path: data.logo_path || null,
    template_html: data.template_html || '',
    template_css: data.template_css || '',
    website_url: data.website_url || '',
    vat_id: data.vat_id || '',
    tax_rate: data.tax_rate ?? 19.0
  })
  return getBrand(info.lastInsertRowid as number)!
}

export function updateBrand(id: number, data: Partial<NewBrand>): Brand {
  const sets: string[] = []
  const params: Record<string, unknown> = { id }
  const allowed = ['name', 'logo_path', 'template_html', 'template_css', 'website_url', 'vat_id', 'tax_rate']
  for (const key of allowed) {
    if (key in data) {
      sets.push(`${key} = @${key}`)
      params[key] = (data as Record<string, unknown>)[key]
    }
  }
  if (sets.length > 0) {
    sets.push("updated_at = datetime('now')")
    db.prepare(`UPDATE brands SET ${sets.join(', ')} WHERE id = @id`).run(params)
  }
  return getBrand(id)!
}

export function deleteBrand(id: number): void {
  db.prepare('DELETE FROM brands WHERE id = ?').run(id)
}

// --- RECEIPTS ---

export function getAllReceipts(): ReceiptWithItems[] {
  const receipts = db.prepare('SELECT * FROM receipts ORDER BY created_at DESC').all() as Receipt[]
  return receipts.map(r => ({
    ...r,
    items: db.prepare('SELECT * FROM receipt_items WHERE receipt_id = ? ORDER BY sort_order').all(r.id) as ReceiptItem[],
    brand: db.prepare('SELECT * FROM brands WHERE id = ?').get(r.brand_id) as Brand | undefined
  }))
}

export function getReceipt(id: number): ReceiptWithItems | undefined {
  const receipt = db.prepare('SELECT * FROM receipts WHERE id = ?').get(id) as Receipt | undefined
  if (!receipt) return undefined
  return {
    ...receipt,
    items: db.prepare('SELECT * FROM receipt_items WHERE receipt_id = ? ORDER BY sort_order').all(receipt.id) as ReceiptItem[],
    brand: db.prepare('SELECT * FROM brands WHERE id = ?').get(receipt.brand_id) as Brand | undefined
  }
}

export function saveReceipt(data: NewReceiptData): number {
  const insertReceipt = db.prepare(`
    INSERT INTO receipts (brand_id, receipt_number, order_number, date, customer_name, customer_address, customer_city, customer_zip, customer_country, subtotal, shipping, tax_rate, tax_amount, total, payment_method, currency)
    VALUES (@brand_id, @receipt_number, @order_number, @date, @customer_name, @customer_address, @customer_city, @customer_zip, @customer_country, @subtotal, @shipping, @tax_rate, @tax_amount, @total, @payment_method, @currency)
  `)
  const result = insertReceipt.run({
    brand_id: data.brand_id,
    receipt_number: data.receipt_number,
    order_number: data.order_number,
    date: data.date,
    customer_name: data.customer_name,
    customer_address: data.customer_address,
    customer_city: data.customer_city,
    customer_zip: data.customer_zip,
    customer_country: data.customer_country,
    subtotal: data.subtotal,
    shipping: data.shipping,
    tax_rate: data.tax_rate,
    tax_amount: data.tax_amount,
    total: data.total,
    payment_method: data.payment_method,
    currency: data.currency
  })
  const receiptId = result.lastInsertRowid as number

  const insertItem = db.prepare(`
    INSERT INTO receipt_items (receipt_id, name, color, size, quantity, unit_price, line_total, image_url, image_local_path, sort_order)
    VALUES (@receipt_id, @name, @color, @size, @quantity, @unit_price, @line_total, @image_url, @image_local_path, @sort_order)
  `)

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i]
    insertItem.run({
      receipt_id: receiptId,
      name: item.name,
      color: item.color || null,
      size: item.size || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.unit_price * item.quantity,
      image_url: item.image_url || null,
      image_local_path: item.image_local_path || null,
      sort_order: i
    })
  }

  return receiptId
}

export function updateReceiptHtml(id: number, html: string): void {
  db.prepare('UPDATE receipts SET html_content = ? WHERE id = ?').run(html, id)
}

export function updateReceiptScreenshot(id: number, screenshotPath: string): void {
  db.prepare('UPDATE receipts SET screenshot_path = ? WHERE id = ?').run(screenshotPath, id)
}

export function deleteReceipt(id: number): void {
  db.prepare('DELETE FROM receipts WHERE id = ?').run(id)
}

// --- RECEIPT NUMBERS ---

export function getNextReceiptNumber(brandId: number): string {
  let row = db.prepare('SELECT * FROM receipt_numbers WHERE brand_id = ?').get(brandId) as { prefix: string; next_number: number } | undefined
  if (!row) {
    db.prepare('INSERT INTO receipt_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)').run(brandId, '', 1000)
    row = { prefix: '', next_number: 1000 }
  }
  const num = row.next_number
  db.prepare('UPDATE receipt_numbers SET next_number = ? WHERE brand_id = ?').run(num + 1, brandId)
  return row.prefix + String(num).padStart(6, '0')
}

export function getNextOrderNumber(brandId: number): string {
  let row = db.prepare('SELECT * FROM order_numbers WHERE brand_id = ?').get(brandId) as { prefix: string; next_number: number } | undefined
  if (!row) {
    db.prepare('INSERT INTO order_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)').run(brandId, '', 1000000)
    row = { prefix: '', next_number: 1000000 }
  }
  const num = row.next_number
  db.prepare('UPDATE order_numbers SET next_number = ? WHERE brand_id = ?').run(num + 1, brandId)
  return row.prefix + String(num).padStart(10, '0')
}

// --- BRAND SELECTORS ---

export function getBrandSelectors(brandId: number): BrandSelector[] {
  return db.prepare('SELECT * FROM brand_selectors WHERE brand_id = ?').all(brandId) as BrandSelector[]
}

export function saveBrandSelector(brandId: number, urlPattern: string, selectors: Omit<BrandSelector, 'id' | 'brand_id' | 'url_pattern' | 'last_validated'>): void {
  const existing = db.prepare('SELECT id FROM brand_selectors WHERE brand_id = ? AND url_pattern = ?').get(brandId, urlPattern) as { id: number } | undefined
  if (existing) {
    db.prepare(`
      UPDATE brand_selectors SET product_name_sel = ?, product_price_sel = ?, product_image_sel = ?, product_options_sel = ?, last_validated = datetime('now')
      WHERE id = ?
    `).run(selectors.product_name_sel, selectors.product_price_sel, selectors.product_image_sel, selectors.product_options_sel, existing.id)
  } else {
    db.prepare(`
      INSERT INTO brand_selectors (brand_id, url_pattern, product_name_sel, product_price_sel, product_image_sel, product_options_sel, last_validated)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(brandId, urlPattern, selectors.product_name_sel, selectors.product_price_sel, selectors.product_image_sel, selectors.product_options_sel)
  }
}

// --- SEED ---

export function seedArcteryx(): Brand {
  const existing = db.prepare("SELECT * FROM brands WHERE name = ?").get("Arc'teryx") as Brand | undefined
  if (existing) return existing

  const brand = createBrand({
    name: "Arc'teryx",
    website_url: 'https://www.arcteryx.com',
    vat_id: 'DE298877565',
    tax_rate: 19.0,
    template_html: getArcteryxTemplate(),
    template_css: ''
  })

  // Initialize number counters
  db.prepare('INSERT INTO receipt_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)').run(brand.id, '55', 15521335)
  db.prepare('INSERT INTO order_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)').run(brand.id, '00', 44399093)

  // Default selector for Arcteryx product URLs
  saveBrandSelector(brand.id, '*.arcteryx.com/*', {
    product_name_sel: 'h1.product-name, .product-title, [data-testid="product-name"]',
    product_price_sel: '.product-price, [data-testid="product-price"], .price',
    product_image_sel: '.product-image img, [data-testid="product-image"] img, .gallery-image img',
    product_options_sel: JSON.stringify({ color: '.color-swatch.selected', size: '.size-option.selected' })
  })

  return brand
}

export function closeDatabase(): void {
  if (db) db.close()
}
