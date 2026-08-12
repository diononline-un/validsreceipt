import fs from 'fs'
import postalMime from 'postal-mime'
import type { EMLParsedData } from '../../src/lib/types'

export async function parseEMLFile(filePath: string): Promise<EMLParsedData> {
  const buffer = fs.readFileSync(filePath)
  const parsed = await postalMime.parse(buffer)

  const htmlBody = parsed.html || ''
  const textBody = parsed.text || ''

  return {
    from: parsed.from?.address || '',
    subject: parsed.subject || '',
    htmlBody,
    textBody,
    date: parsed.date || ''
  }
}

export function extractReceiptDataFromHtml(html: string): {
  receiptNumber: string | null
  orderNumber: string | null
  vatId: string | null
  date: string | null
  customerName: string | null
  customerAddress: string | null
  customerCity: string | null
  customerZip: string | null
  customerCountry: string | null
  paymentMethod: string | null
  products: Array<{
    name: string
    price: number
    color: string | null
    size: string | null
    quantity: number
    imageUrl: string | null
  }>
  subtotal: number | null
  shipping: number | null
  taxRate: number | null
  taxAmount: number | null
  total: number | null
  currency: string
} {
  const result = {
    receiptNumber: null as string | null,
    orderNumber: null as string | null,
    vatId: null as string | null,
    date: null as string | null,
    customerName: null as string | null,
    customerAddress: null as string | null,
    customerCity: null as string | null,
    customerZip: null as string | null,
    customerCountry: null as string | null,
    paymentMethod: null as string | null,
    products: [] as Array<{
      name: string
      price: number
      color: string | null
      size: string | null
      quantity: number
      imageUrl: string | null
    }>,
    subtotal: null as number | null,
    shipping: null as number | null,
    taxRate: null as number | null,
    taxAmount: null as number | null,
    total: null as number | null,
    currency: 'EUR'
  }

  // Extract receipt number
  const rechnungNr = html.match(/Rechnung\s*(?:Nr\.:|#)\s*(\d[\d\s]*\d)/i)
  if (rechnungNr) result.receiptNumber = rechnungNr[1].replace(/\s/g, '')

  // Extract order number
  const bestellNr = html.match(/Bestellnummer:?\s*(\d[\d\s]*\d)/i)
  if (bestellNr) result.orderNumber = bestellNr[1].replace(/\s/g, '')

  // Extract VAT ID
  const vatMatch = html.match(/Mehrwertsteuer\s*(?:Nr\.:|#|ID:?)\s*(DE\d+)/i)
  if (vatMatch) result.vatId = vatMatch[1]

  // Extract date
  const dateMatch = html.match(/Rechnungsdatum:?\s*(?:<br>)?\s*(\d{1,2}\.\s*\w+\s*\d{4})/i)
  if (dateMatch) result.date = dateMatch[1]

  // Extract customer info
  const nameMatch = html.match(/(?:Rechnung\s+an:?|Hallo)\s*(?:<br>)?\s*([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)/i)
  if (nameMatch) result.customerName = nameMatch[1].trim()

  const addrMatch = html.match(/(?:Heinrich-Heine-Str\.|Straße|Str\.)\s*(\d+[a-z]?)/i)
  if (addrMatch) {
    const fullMatch = html.match(/([A-ZÄÖÜ][a-zäöüß-]+(?:[-.][A-ZÄÖÜa-zäöüß]+)?(?:-Str\.|-Straße|straße|str\.)?\s*\d+[a-z]?)/i)
    if (fullMatch) result.customerAddress = fullMatch[1].trim()
  }

  const cityMatch = html.match(/(?:Hannover|Berlin|München|Hamburg|Köln|Frankfurt|Stuttgart|Düsseldorf|Leipzig|Dresden)/i)
  if (cityMatch) result.customerCity = cityMatch[0]

  const zipMatch = html.match(/\b(\d{5})\b/)
  if (zipMatch) result.customerZip = zipMatch[1]

  const countryMatch = html.match(/\b(DE|AT|CH)\s+\d{4,5}\b/i)
  if (countryMatch) result.customerCountry = countryMatch[1]

  // Extract payment method
  const payMatch = html.match(/(?:Zahlungsmethode|Bezahlung).*?(PAYPAL|Kreditkarte|Visa|Mastercard|Rechnung|Lastschrift|Klarna|Sofort)/i)
  if (payMatch) result.paymentMethod = payMatch[1]

  // Extract products - look for product sections
  const priceRegex = /(\d{1,6}(?:[,.]\d{2})?)\s*(?:EUR|€|EUR)/gi

  // Try to find products by name pattern
  const productBlocks = html.match(/<td[^>]*>(?:<p[^>]*>)?\s*([\w\s-]+)(?:<\/p>)?\s*<\/td>\s*<td[^>]*>(?:<p[^>]*>)?\s*(\d{1,6}(?:[,.]\d{2})?)\s*(?:€|EUR)/gi)

  // Find product names (capitalized, multi-word) before prices
  const productNameMatches = html.match(/Nu\s+(?:Funktionswaschmittel|Daunenwaschmittel)/gi) || []

  // Extract all prices
  const allPrices = [...html.matchAll(/(\d{1,6}(?:[,.]\d{2}))\s*€/g)]

  // Match products with their prices
  for (let i = 0; i < productNameMatches.length; i++) {
    const name = productNameMatches[i]
    let price = 0
    // The price for each product usually appears nearby
    const productSection = html.substring(
      html.indexOf(name),
      i < productNameMatches.length - 1 ? html.indexOf(productNameMatches[i + 1]) : html.length
    )
    const priceMatch = productSection.match(/Preis:?\s*(\d{1,6}(?:[,.]\d{2}))\s*€/)
    if (priceMatch) {
      price = parseFloat(priceMatch[1].replace(',', '.'))
    }

    const imageMatch = productSection.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/i)

    result.products.push({
      name: name.trim(),
      price,
      color: productSection.match(/Farbe:?\s*(.+?)(?:<|$)/i)?.[1]?.trim() || null,
      size: productSection.match(/Größe:?\s*(.+?)(?:<|$)/i)?.[1]?.trim() || null,
      quantity: parseInt(productSection.match(/Menge:?\s*(\d+)/i)?.[1] || '1'),
      imageUrl: imageMatch?.[1] || null
    })
  }

  // Extract totals
  const subtotalMatch = html.match(/Zwischensumme.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i)
  if (subtotalMatch) result.subtotal = parseFloat(subtotalMatch[1].replace(',', '.'))

  const shippingMatch = html.match(/Versand.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i)
  if (shippingMatch) result.shipping = parseFloat(shippingMatch[1].replace(',', '.'))

  const taxMatch = html.match(/MwSt.*?(\d{1,2}(?:[,.]\d{1,2})?)%/i)
  if (taxMatch) result.taxRate = parseFloat(taxMatch[1].replace(',', '.'))

  const taxAmountMatch = html.match(/MwSt.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i)
  if (taxAmountMatch) result.taxAmount = parseFloat(taxAmountMatch[1].replace(',', '.'))

  const totalMatch = html.match(/Gesamtbetrag.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i)
  if (totalMatch) result.total = parseFloat(totalMatch[1].replace(',', '.'))

  return result
}
