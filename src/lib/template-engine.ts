export interface ProductData {
  name: string
  image_url: string
  image_local_path?: string
  color: string
  size: string
  quantity: number
  price: number  // unit price
  line_total: number  // price * quantity
}

export interface ReceiptTemplateData {
  receipt_number: string
  order_number: string
  vat_id: string
  date: string
  customer_name: string
  customer_address: string
  customer_city: string
  customer_zip: string
  customer_country: string
  subtotal: string
  shipping: string
  tax_rate: string
  tax_amount: string
  total: string
  payment_method: string
  currency: string
}

export function extractPlaceholders(templateHtml: string): string[] {
  const regex = /\{\{([^#/}][^}]*)\}\}/g
  const found = new Set<string>()
  let match
  while ((match = regex.exec(templateHtml)) !== null) {
    found.add(match[1].trim())
  }
  return Array.from(found)
}

export function renderTemplate(templateHtml: string, data: Record<string, any>): string {
  let result = templateHtml

  // 1. Handle product loop FIRST (before simple substitution)
  const productLoopRegex = /\{\{#products\}\}([\s\S]*?)\{\{\/products\}\}/
  const loopMatch = result.match(productLoopRegex)

  if (loopMatch && Array.isArray(data['products']) && data['products'].length > 0) {
    const rowTemplate = loopMatch[1]
    const products: ProductData[] = data['products']
    let productsHtml = ''

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      let row = rowTemplate
      row = row.replace(/\{\{name\}\}/g, escapeAttr(product.name))
      row = row.replace(/\{\{image_url\}\}/g, product.image_url || '')
      row = row.replace(/\{\{color\}\}/g, product.color || 'No Color')
      row = row.replace(/\{\{size\}\}/g, product.size || 'No Size')
      row = row.replace(/\{\{quantity\}\}/g, String(product.quantity))
      row = row.replace(/\{\{price\}\}/g, formatPriceDE(product.price))
      row = row.replace(/\{\{line_total\}\}/g, formatPriceDE(product.line_total))
      productsHtml += `<!--PRODUCT:${i}-->${row}<!--/PRODUCT:${i}-->`
    }

    // Replace the loop block with generated product rows
    result = result.replace(productLoopRegex, productsHtml)
  } else {
    // No products → remove the loop block
    result = result.replace(/\{\{#products\}\}[\s\S]*?\{\{\/products\}\}/g, '')
  }

  // 2. Simple {{key}} substitution
  result = result.replace(/\{\{([^#/}][^}]*)\}\}/g, (_, key: string) => {
    const k = key.trim()
    const val = data[k]
    if (val === undefined || val === null || val === '') return ''
    return escapeHtml(String(val))
  })

  return result
}

function formatPriceDE(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' \u20AC'
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
