export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface DeepSeekResponse {
  id: string
  choices: Array<{
    message: { role: string; content: string }
    finish_reason: string
  }>
  usage?: { total_tokens: number }
}

const API_KEY = 'REDACTED-ROTATED'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'
const MODEL = 'deepseek-chat'

async function chat(messages: DeepSeekMessage[], temperature?: number): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: temperature ?? 0.1,
      max_tokens: 4096,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepSeek API error ${res.status}: ${err}`)
  }

  const data: DeepSeekResponse = await res.json()
  return data.choices[0].message.content
}

/**
 * Extract structured receipt data from HTML email body using AI.
 * Returns JSON or null on failure.
 */
export async function aiParseReceiptHtml(htmlBody: string): Promise<Record<string, unknown> | null> {
  const systemPrompt = `Du bist ein Spezialist fur Rechnungsverarbeitung. Extrahiere aus dem HTML-Code einer Bestellbestatigungs-E-Mail die Rechnungsdaten.

Antworte NUR mit einem gultigen JSON-Objekt (kein Markdown, kein Code-Block). Das JSON muss exakt diese Struktur haben:

{
  "receipt_number": "string oder null",
  "order_number": "string oder null",
  "vat_id": "string oder null",
  "date": "string oder null (DD.MM.YYYY)",
  "customer_name": "string oder null",
  "customer_address": "string oder null",
  "customer_city": "string oder null",
  "customer_zip": "string oder null",
  "customer_country": "string oder null (DE/AT/CH)",
  "payment_method": "string oder null",
  "currency": "string (EUR/USD/CHF)",
  "subtotal": "number oder null",
  "shipping": "number oder null",
  "tax_rate": "number oder null",
  "tax_amount": "number oder null",
  "total": "number oder null",
  "products": [
    {
      "name": "string",
      "price": "number",
      "color": "string oder null",
      "size": "string oder null",
      "quantity": "number",
      "image_url": "string oder null"
    }
  ]
}

Regeln:
- Preise als Zahlen OHNE Wahrungssymbol (z.B. 18.00 statt "18,00€")
- Datum als DD.MM.YYYY
- Wenn ein Feld nicht gefunden wird, null setzen
- Produkte aus dem Bereich "Artikel in deiner Bestellung" extrahieren
- Steuersatz aus "MwSt X%" parsen als Zahl (z.B. 19)`

  const trimmedHtml = htmlBody.length > 80000
    ? htmlBody.substring(0, 80000) + '\n... (truncated)'
    : htmlBody

  try {
    const resp = await chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Extrahiere die Rechnungsdaten aus diesem E-Mail-HTML:\n\n${trimmedHtml}` },
    ])

    // Try to parse JSON from response
    const jsonMatch = resp.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch (err) {
    console.error('[AI Receipt Parser] Failed:', err)
    return null
  }
}

/**
 * Analyze a product page URL's HTML to determine the best CSS selectors
 * for product name, price, image, and options.
 */
export async function aiDetectSelectors(pageContent: string): Promise<{
  name_selector: string
  price_selector: string
  image_selector: string
  confidence: number
} | null> {
  const systemPrompt = `Du bist ein Web-Scraping-Experte. Analysiere den HTML-Code einer Produktseite und finde die besten CSS-Selektoren fur:

1. Produktname
2. Preis
3. Produktbild-URL

Antworte NUR mit diesem JSON-Format (kein Markdown):
{
  "name_selector": "css-selector",
  "price_selector": "css-selector", 
  "image_selector": "css-selector",
  "confidence": 0.0-1.0
}

Regeln fur Selektoren:
- Bevorzuge spezifische Selektoren wie [data-testid="..."] oder meta[property="..."]
- Dann Klassen wie .product-title, .price
- Vermeide zu generische Selektoren
- Der Bild-Selector soll ein <img> oder meta[property="og:image"] treffen
- Der Preis-Selector soll das HTML-Element mit dem Preis treffen
- confidence: wie sicher bist du dass die Selektoren korrekt sind?`

  const trimmedContent = pageContent.length > 60000
    ? pageContent.substring(0, 60000)
    : pageContent

  try {
    const resp = await chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analysiere diese Produktseite und finde CSS-Selektoren:\n\n${trimmedContent}` },
    ])

    const jsonMatch = resp.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch (err) {
    console.error('[AI Selector Detector] Failed:', err)
    return null
  }
}

/**
 * AI-enhanced EML data extraction.
 * First tries regex extraction (fast), then AI enhances missing fields.
 */
export async function aiEnhanceReceiptData(
  htmlBody: string,
  regexResult: Record<string, unknown>
): Promise<Record<string, unknown>> {
  // If regex already got all important fields, skip AI
  const keyFields = ['receipt_number', 'products', 'total', 'customer_name', 'date']
  const hasAll = keyFields.every(f => regexResult[f] != null && regexResult[f] !== undefined)
  if (hasAll && Array.isArray(regexResult.products) && regexResult.products.length > 0) {
    return regexResult
  }

  // Use AI to fill in missing data
  const aiResult = await aiParseReceiptHtml(htmlBody)
  if (!aiResult) return regexResult

  // Merge: regex data takes priority, AI fills gaps
  const merged: Record<string, unknown> = { ...aiResult }
  for (const [key, value] of Object.entries(regexResult)) {
    if (value !== null && value !== undefined && value !== '' && value !== 0
      && !(Array.isArray(value) && value.length === 0)) {
      merged[key] = value
    }
  }

  return merged
}

/**
 * Trains a new brand template from sample email HTML.
 * AI identifies variable parts and replaces them with {{placeholders}}.
 */
export async function aiTrainTemplate(sampleHtml: string): Promise<{
  template_html: string
  placeholders: string[]
  brand_name: string
} | null> {
  const systemPrompt = `Du bist ein Spezialist fur E-Mail-Template-Erstellung. Analysiere den HTML-Code einer Bestellbestatigungs-E-Mail und ersetze ALLE variablen Daten durch {{platzhalter}}.

REGELN:
1. Das komplette HTML-Layout, CSS und die Struktur MUSSEN exakt erhalten bleiben
2. Ersetze variable Daten durch aussagekraftige Platzhalter in {{doppelten_geschweiften_klammern}}
3. Produkt-Zeilen (die sich wiederholen) mit {{#products}}...{{/products}} umschliessen
4. Innerhalb der Produkt-Schleife: {{name}}, {{image_url}}, {{color}}, {{size}}, {{quantity}}, {{price}}, {{line_total}}
5. Ersetze KEINE URLs, Links, Bild-Pfade oder Style-Definitionen
6. Gib den Firmen-/Markennamen als brand_name zuruck
7. Gib alle gefundenen Platzhalter als Array zuruck

Antworte NUR mit diesem JSON (kein Markdown, kein Code-Block):
{
  "template_html": "das komplette HTML mit Platzhaltern",
  "placeholders": ["receipt_number", "customer_name", ...],
  "brand_name": "Markenname" 
}`

  const trimmedHtml = sampleHtml.length > 120000
    ? sampleHtml.substring(0, 120000)
    : sampleHtml

  try {
    const resp = await chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Konvertiere dieses E-Mail-HTML in ein Template mit Platzhaltern:\n\n${trimmedHtml}` },
    ])

    // Try to extract JSON from response
    const jsonMatch = resp.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const result = JSON.parse(jsonMatch[0])
    if (!result.template_html || !result.placeholders) return null

    return {
      template_html: result.template_html,
      placeholders: result.placeholders,
      brand_name: result.brand_name || 'Neue Marke',
    }
  } catch (err) {
    console.error('[AI Train Template] Failed:', err)
    return null
  }
}
