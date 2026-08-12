/**
 * Parse pasted HTML to extract product data.
 * Handles both Arcteryx cart flyout HTML and generic product page HTML.
 */

export interface ParsedCartProduct {
  name: string
  price: number
  color: string
  size: string
  quantity: number
  image_url: string
}

export function parsePastedHtml(html: string): ParsedCartProduct[] {
  const products: ParsedCartProduct[] = []

  // ---- Strategy 1: Arcteryx cart flyout ----
  // Uses classes like .qa-cart-item-name, .qa-cart-item-colour, etc.
  const arcCartItems = extractAll(html, /<div[^>]*class="[^"]*sc-f26689d9-0[^"]*"[^>]*>([\s\S]*?)<button[^>]*class="[^"]*qa-cart-item-remove[^"]*"/gi)
  if (arcCartItems.length > 0) {
    for (const block of arcCartItems) {
      const product = extractArcCartItem(block)
      if (product.name) products.push(product)
    }
    if (products.length > 0) return products
  }

  // Try alternative Arcteryx cart structure
  const cartWraps = extractAll(html, /<div[^>]*class="[^"]*cart-wrap[^"]*"[^>]*>([\s\S]*?)<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/gi)
  if (cartWraps.length > 0) {
    for (const block of cartWraps) {
      const product = extractArcCartItem(block)
      if (product.name) products.push(product)
    }
    if (products.length > 0) return products
  }

  // ---- Strategy 2: Generic product page HTML ----
  // Extract from meta tags
  const ogTitle = extractMeta(html, 'og:title')
  const ogImage = extractMeta(html, 'og:image')
  const priceAmount = extractMeta(html, 'product:price:amount')

  if (ogTitle) {
    products.push({
      name: ogTitle.split('|')[0].split('–')[0].trim(),
      price: parseFloat(priceAmount) || 0,
      color: '',
      size: '',
      quantity: 1,
      image_url: ogImage || '',
    })
    return products
  }

  // ---- Strategy 3: Try to find any product-like structure ----
  // Look for images with product URLs and nearby text
  const imgMatches = html.match(/<img[^>]*src="(https:\/\/images\.arcteryx\.com\/[^"]*(?:1350x1710|F2\d)\/[^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi)
  if (imgMatches) {
    for (const imgTag of imgMatches) {
      const src = imgTag.match(/src="([^"]*)"/)?.[1] || ''
      const alt = imgTag.match(/alt="([^"]*)"/)?.[1] || ''
      if (src && !products.find(p => p.image_url === src)) {
        products.push({
          name: alt || 'Produkt',
          price: 0,
          color: '',
          size: '',
          quantity: 1,
          image_url: src,
        })
      }
    }
    if (products.length > 0) return products
  }

  // ---- Strategy 4: Generic product images ----
  const allImgs = html.match(/<img[^>]*src="(https:\/\/images\.arcteryx\.com\/[^"]*)"[^>]*>/gi)
  if (allImgs) {
    for (const imgTag of allImgs.slice(0, 3)) {
      const src = imgTag.match(/src="([^"]*)"/)?.[1] || ''
      if (src) {
        products.push({
          name: 'Produkt',
          price: 0,
          color: '',
          size: '',
          quantity: 1,
          image_url: src,
        })
      }
    }
  }

  return products
}

function extractArcCartItem(html: string): ParsedCartProduct {
  const name = extractByClass(html, 'qa-cart-item-name') || extractByClass(html, 'product-title') || ''
  const color = extractByClass(html, 'qa-cart-item-colour')?.trim() || ''
  const size = extractByClass(html, 'qa-cart-item-size')?.trim() || ''
  const qtyStr = extractByClass(html, 'qa-cart-item-quantity')
  const quantity = qtyStr ? parseInt(qtyStr) || 1 : 1

  // Price
  let price = 0
  const priceMatch = html.match(/qa-cart-item-price[^>]*>[\s\S]*?(\d{1,6}(?:[,.]\d{2})?)\s*(?:&nbsp;)?[€$EUR]/i)
  if (priceMatch) {
    price = parseFloat(priceMatch[1].replace(',', '.').replace(/\s/g, ''))
  } else {
    // Try line-price
    const lpMatch = html.match(/line-price[^>]*>[\s\S]*?(\d{1,6}(?:[,.]\d{2})?)\s*(?:&nbsp;)?[€$]/i)
    if (lpMatch) price = parseFloat(lpMatch[1].replace(',', '.').replace(/\s/g, ''))
  }

  // Image
  const imgMatch = html.match(/<img[^>]*src="(https:\/\/images\.arcteryx\.com\/[^"]*(?:1350x1710|F2\d)\/[^"]*)"[^>]*/i)
  const imageUrl = imgMatch?.[1] || ''

  return { name, price, color, size, quantity, image_url: imageUrl }
}

function extractByClass(html: string, className: string): string | null {
  const regex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>([^<]*(?:<[^>]*>[^<]*</[^>]*>)?[^<]*)<`, 'i')
  const match = html.match(regex)
  if (!match) return null
  return match[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function extractMeta(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*property="${property}"[^>]*content="([^"]*)"`, 'i')
  const match = html.match(regex)
  return match?.[1] || null
}

function extractAll(html: string, regex: RegExp): string[] {
  const results: string[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1] || match[0])
  }
  return results
}
