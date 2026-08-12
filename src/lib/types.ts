export interface Brand {
  id: number
  name: string
  logo_path: string | null
  template_html: string
  template_css: string
  website_url: string
  vat_id: string
  tax_rate: number
  created_at: string
  updated_at: string
}

export interface BrandSelector {
  id: number
  brand_id: number
  url_pattern: string
  product_name_sel: string
  product_price_sel: string
  product_image_sel: string
  product_options_sel: string // JSON stringified object
  last_validated: string | null
}

export interface ScrapedProduct {
  name: string
  price: number
  image_url: string
  image_local_path?: string
  color?: string
  size?: string
  options?: Record<string, string>
}

export interface Receipt {
  id: number
  brand_id: number
  receipt_number: string
  order_number: string
  date: string
  customer_name: string
  customer_address: string
  customer_city: string
  customer_zip: string
  customer_country: string
  subtotal: number
  shipping: number
  tax_rate: number
  tax_amount: number
  total: number
  payment_method: string
  currency: string
  html_content: string
  screenshot_path: string | null
  created_at: string
}

export interface ReceiptItem {
  id: number
  receipt_id: number
  name: string
  color: string | null
  size: string | null
  quantity: number
  unit_price: number
  line_total: number
  image_url: string | null
  image_local_path: string | null
  sort_order: number
}

export interface ReceiptNumber {
  id: number
  brand_id: number
  prefix: string
  next_number: number
}

export interface ReceiptWithItems extends Receipt {
  items: ReceiptItem[]
  brand?: Brand
}

export interface NewBrand {
  name: string
  logo_path?: string
  template_html?: string
  template_css?: string
  website_url?: string
  vat_id?: string
  tax_rate?: number
}

export interface NewReceiptData {
  brand_id: number
  receipt_number: string
  order_number: string
  date: string
  customer_name: string
  customer_address: string
  customer_city: string
  customer_zip: string
  customer_country: string
  subtotal: number
  shipping: number
  tax_rate: number
  tax_amount: number
  total: number
  payment_method: string
  currency: string
  items: Omit<ReceiptItem, 'id' | 'receipt_id' | 'line_total' | 'sort_order'>[]
}

export interface EMLParsedData {
  from: string
  subject: string
  htmlBody: string
  textBody: string
  date: string
}

export type IPCChannels =
  | 'db:get-brands'
  | 'db:get-brand'
  | 'db:create-brand'
  | 'db:update-brand'
  | 'db:delete-brand'
  | 'db:get-receipts'
  | 'db:get-receipt'
  | 'db:save-receipt'
  | 'db:delete-receipt'
  | 'db:get-next-receipt-number'
  | 'db:get-next-order-number'
  | 'db:get-brand-selectors'
  | 'db:save-brand-selectors'
  | 'db:seed-arcteryx'
  | 'parse:eml'
  | 'scrape:url'
  | 'screenshot:receipt'
  | 'app:get-version'
  | 'dialog:open-file'
  | 'dialog:save-file'
  | 'file:read'
  | 'file:write'
