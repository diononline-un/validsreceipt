<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from '../lib/router.svelte.ts'
  import type { Brand, ScrapedProduct } from '../lib/types'
  import { formatPrice, formatDateLong, todayString, parseNumberInput } from '../lib/utils'
  import { renderTemplate } from '../lib/template-engine'

  interface ProductItem {
    name: string
    price: number
    color: string
    size: string
    quantity: number
    image_url: string
    image_local_path: string
  }

  let brands: Brand[] = $state([])
  let selectedBrandId = $state<number | null>(null)
  let selectedBrand = $state<Brand | null>(null)
  let products = $state<ProductItem[]>([])
  let receiptNumber = $state('')
  let orderNumber = $state('')
  let date = $state(todayString())
  let customerName = $state('Dion Otto')
  let customerAddress = $state('Heinrich-Heine-Str. 5')
  let customerCity = $state('Hannover')
  let customerZip = $state('30173')
  let customerCountry = $state('DE')
  let paymentMethod = $state('PAYPAL')
  let currency = $state('EUR')
  let taxRate = $state(19)
  let shipping = $state(0)
  let isLoadingNumbers = $state(false)
  let isScraping = $state(false)
  let isCartScraping = $state(false)
  let pasteHtml = $state('')
  let showPaste = $state(false)
  let scrapeUrl = $state('')
  let previewHtml = $state('')
  let mailTheme = $state<'light' | 'dark'>('light')
  let selectedProductIndex = $state<number | null>(null)

  function handleMailBodyClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    // Walk up to find data-product-index
    let el: HTMLElement | null = target
    while (el) {
      const idx = el.getAttribute?.('data-product-index')
      if (idx !== null && idx !== undefined) {
        const n = parseInt(idx)
        if (!isNaN(n)) {
          selectedProductIndex = n
          // Scroll to product card
          const card = document.querySelector(`[data-product-card="${n}"]`)
          card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }
      el = el.parentElement
    }
  }

  const subtotal = $derived(products.reduce((sum, p) => sum + p.price * p.quantity, 0))
  const taxAmount = $derived(Math.round(subtotal * (taxRate / 100) * 100) / 100)
  const total = $derived(Math.round((subtotal + shipping) * 100) / 100)

  onMount(async () => {
    brands = await window.api.getBrands()
    if (brands.length > 0) {
      selectedBrandId = brands[0].id
      selectedBrand = brands[0]
      taxRate = selectedBrand.tax_rate
      await generateNumbers()
    }
  })

  async function selectBrand(brandId: number) {
    selectedBrandId = brandId
    selectedBrand = brands.find(b => b.id === brandId) || null
    if (selectedBrand) {
      taxRate = selectedBrand.tax_rate
    }
    await generateNumbers()
  }

  async function generateNumbers() {
    if (!selectedBrandId) return
    isLoadingNumbers = true
    try {
      receiptNumber = await window.api.getNextReceiptNumber(selectedBrandId)
      orderNumber = await window.api.getNextOrderNumber(selectedBrandId)
    } catch (e) {
      console.error(e)
    }
    isLoadingNumbers = false
  }

  async function scrapeProduct() {
    if (!scrapeUrl) return
    isScraping = true
    try {
      const scraped: ScrapedProduct = await window.api.scrapeURL(scrapeUrl)
      products = [...products, {
        name: scraped.name || 'Produkt',
        price: scraped.price || 0,
        color: scraped.options?.color || '',
        size: scraped.options?.size || '',
        quantity: 1,
        image_url: scraped.image_url || '',
        image_local_path: scraped.image_local_path || ''
      }]
      scrapeUrl = ''
    } catch (e) {
      console.error('Failed to scrape:', e)
    }
    isScraping = false
  }

  async function scrapeBraveCart() {
    isCartScraping = true
    try {
      const scrapedProducts: ScrapedProduct[] = await window.api.scrapeCart()
      if (scrapedProducts && scrapedProducts.length > 0) {
        products = [...products, ...scrapedProducts.map(p => ({
          name: p.name || 'Produkt',
          price: p.price || 0,
          color: p.options?.color || '',
          size: p.options?.size || '',
          quantity: 1,
          image_url: p.image_url || '',
          image_local_path: p.image_local_path || ''
        }))]
      }
    } catch (e) {
      console.error('Cart scraping failed:', e)
    }
    isCartScraping = false
  }

  async function handlePasteHtml() {
    if (!pasteHtml.trim()) return
    try {
      const parsed = await window.api.parseHtml(pasteHtml)
      if (parsed && parsed.length > 0) {
        products = [...products, ...parsed.map((p: any) => ({
          name: p.name || 'Produkt',
          price: p.price || 0,
          color: p.color || '',
          size: p.size || '',
          quantity: p.quantity || 1,
          image_url: p.image_url || '',
          image_local_path: ''
        }))]
        pasteHtml = ''
        showPaste = false
      }
    } catch (e) {
      console.error('HTML paste failed:', e)
    }
  }

  function addProduct() {
    products = [...products, {
      name: '',
      price: 0,
      color: '',
      size: '',
      quantity: 1,
      image_url: '',
      image_local_path: ''
    }]
  }

  function removeProduct(index: number) {
    products = products.filter((_, i) => i !== index)
  }

  function updateProduct(index: number, field: keyof ProductItem, value: any) {
    const updated = [...products]
    updated[index] = { ...updated[index], [field]: value }
    products = updated
  }

  async function handleEMLImport() {
    const filePath = await window.api.openFileDialog([{ name: 'Email', extensions: ['eml'] }])
    if (!filePath) return
    try {
      const result = await window.api.parseEML(filePath)
      applyParsedReceiptData(result.receiptData)
    } catch (e) {
      console.error('EML import failed:', e)
    }
  }

  async function handleAIEMLImport() {
    const filePath = await window.api.openFileDialog([{ name: 'Email', extensions: ['eml'] }])
    if (!filePath) return
    try {
      const result = await window.api.parseEMLAI(filePath)
      applyParsedReceiptData(result.receiptData)
    } catch (e) {
      console.error('AI EML import failed:', e)
    }
  }

  function applyParsedReceiptData(rd: any) {
    if (!rd) return
    if (rd.receipt_number || rd.receiptNumber) receiptNumber = rd.receipt_number || rd.receiptNumber
    if (rd.order_number || rd.orderNumber) orderNumber = rd.order_number || rd.orderNumber
    if (rd.date) date = formatDateForInput(rd.date)
    if (rd.customer_name || rd.customerName) customerName = rd.customer_name || rd.customerName
    if (rd.customer_address || rd.customerAddress) customerAddress = rd.customer_address || rd.customerAddress
    if (rd.customer_city || rd.customerCity) customerCity = rd.customer_city || rd.customerCity
    if (rd.customer_zip || rd.customerZip) customerZip = String(rd.customer_zip || rd.customerZip || '')
    if (rd.customer_country || rd.customerCountry) customerCountry = rd.customer_country || rd.customerCountry
    if (rd.payment_method || rd.paymentMethod) paymentMethod = rd.payment_method || rd.paymentMethod
    if (rd.tax_rate || rd.taxRate) taxRate = Number(rd.tax_rate || rd.taxRate)
    if (rd.shipping != null) shipping = Number(rd.shipping)
    if (rd.products && rd.products.length > 0) {
      products = rd.products.map((p: any) => ({
        name: p.name || '',
        price: Number(p.price || 0),
        color: p.color || '',
        size: p.size || '',
        quantity: Number(p.quantity || 1),
        image_url: p.image_url || p.imageUrl || '',
        image_local_path: p.image_local_path || ''
      }))
    }
  }

  function formatDateForInput(dateStr: string): string {
    if (!dateStr) return todayString()
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    const parts = dateStr.match(/(\d{1,2})\D+(\d{2}|\w+)\D+(\d{4})/)
    if (parts) {
      const day = parts[1].padStart(2, '0')
      const monMap: Record<string, string> = {
        '01': '01','1': '01','januar': '01','februar': '02','märz': '03','april': '04','mai': '05','juni': '06',
        'juli': '07','august': '08','september': '09','oktober': '10','november': '11','dezember': '12',
        '02': '02','03': '03','04': '04','05': '05','06': '06','07': '07','08': '08','09': '09','10': '10','11': '11','12': '12',
      }
      const mon = monMap[parts[2].toLowerCase()] || parts[2].padStart(2, '0')
      return `${parts[3]}-${mon}-${day}`
    }
    return todayString()
  }

  function buildTemplateData(): Record<string, any> {
    return {
      receipt_number: receiptNumber,
      order_number: orderNumber,
      vat_id: selectedBrand?.vat_id || '',
      date: formatDateLong(date),
      customer_name: customerName,
      customer_name_first: customerName.split(' ')[0] || customerName,
      customer_address: customerAddress,
      customer_city: customerCity,
      customer_zip: customerZip,
      customer_country: customerCountry,
      subtotal: formatPrice(subtotal, currency),
      shipping: formatPrice(shipping, currency),
      tax_rate: String(taxRate.toFixed(2)).replace('.', ',') + '%',
      tax_amount: formatPrice(taxAmount, currency),
      total: formatPrice(total, currency),
      payment_method: paymentMethod,
      currency,
      products: products.map(p => ({
        name: p.name,
        image_url: p.image_local_path ? `file://${p.image_local_path}` : p.image_url,
        color: p.color || 'No Color',
        size: p.size || 'No Size',
        quantity: p.quantity,
        price: p.price,
        line_total: p.price * p.quantity,
      })),
    }
  }

  $effect(() => {
    const template = selectedBrand?.template_html
    if (!template) {
      previewHtml = ''
      return
    }
    const data = buildTemplateData()
    let rendered = renderTemplate(template, data)
    
    // Post-process: wrap product markers in identifiable divs for click-to-edit
    rendered = rendered.replace(/<!--PRODUCT:(\d+)-->([\s\S]*?)<!--\/PRODUCT:\1-->/g, 
      '<div data-product-index="$1" style="cursor:pointer;">$2</div>')
    
    if (selectedBrand?.template_css && !rendered.includes('<style')) {
      rendered = `<style>${selectedBrand.template_css}</style>` + rendered
    }
    previewHtml = rendered
  })

  async function saveReceipt() {
    if (!selectedBrandId) return
    try {
      const result = await window.api.saveReceipt({
        brand_id: selectedBrandId,
        receipt_number: receiptNumber,
        order_number: orderNumber,
        date,
        customer_name: customerName,
        customer_address: customerAddress,
        customer_city: customerCity,
        customer_zip: customerZip,
        customer_country: customerCountry,
        subtotal,
        shipping,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        payment_method: paymentMethod,
        currency,
        items: products.map((p, i) => ({
          name: p.name,
          unit_price: p.price,
          color: p.color || null,
          size: p.size || null,
          quantity: p.quantity,
          image_url: p.image_url || null,
          image_local_path: p.image_local_path || null,
          sort_order: i,
        })),
      })
      navigate(`/receipts/${result.id}`)
    } catch (e) {
      console.error('Failed to save receipt:', e)
    }
  }
</script>

<div class="generate-page">
  <div class="import-bar">
    <div class="import-row">
      <button class="btn-secondary" onclick={handleEMLImport}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        EML Import
      </button>
      <button class="btn-secondary ai-btn" onclick={handleAIEMLImport}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        AI EML
      </button>
      <button class="btn-secondary" onclick={() => showPaste = !showPaste} class:active={showPaste}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
        HTML Paste
      </button>
      <button class="btn-secondary cart-btn" onclick={scrapeBraveCart} disabled={isCartScraping}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        {isCartScraping ? 'Lade Warenkorb...' : 'Brave Cart'}
      </button>
    </div>
    <div class="import-row">
      <input type="text" placeholder="Produkt-URL eingeben..." bind:value={scrapeUrl} />
      <button class="btn-primary" onclick={scrapeProduct} disabled={isScraping || !scrapeUrl}>
        {isScraping ? 'Scraping...' : 'Scrapen'}
      </button>
      <button class="btn-secondary" onclick={addProduct}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Produkt manuell
      </button>
    </div>
  </div>

  {#if showPaste}
    <div class="paste-area">
      <textarea
        placeholder="HTML hier einfügen (z.B. aus Brave DevTools kopiert)..."
        bind:value={pasteHtml}
        rows="5"
      ></textarea>
      <div class="paste-actions">
        <button class="btn-primary" onclick={handlePasteHtml} disabled={!pasteHtml.trim()}>Produkte extrahieren</button>
        <button class="btn-ghost" onclick={() => { pasteHtml = ''; showPaste = false; }}>Abbrechen</button>
      </div>
    </div>
  {/if}

  <div class="editor-layout">
    <div class="left-panel">
      <div class="field">
        <label class="field-label" for="gen-brand">Marke</label>
        <select
          id="gen-brand"
          value={selectedBrandId ?? ''}
          onchange={(e) => selectBrand(Number((e.target as HTMLSelectElement).value))}
          disabled={brands.length === 0}
        >
          {#if brands.length === 0}
            <option value="">Keine Marken verfügbar</option>
          {/if}
          {#each brands as brand}
            <option value={brand.id}>{brand.name}</option>
          {/each}
        </select>
      </div>

      <div class="field-row">
        <div class="field field-flex">
          <label class="field-label" for="gen-receipt">Rechnung</label>
          <div class="field-with-btn">
            <input id="gen-receipt" type="text" bind:value={receiptNumber} disabled={!selectedBrandId} />
            <button class="btn-ghost field-btn" onclick={generateNumbers} disabled={!selectedBrandId || isLoadingNumbers} title="Neue Rechnungsnummer generieren">
              Neu
            </button>
          </div>
        </div>
        <div class="field field-flex">
          <label class="field-label" for="gen-order">Bestellnr</label>
          <div class="field-with-btn">
            <input id="gen-order" type="text" bind:value={orderNumber} disabled={!selectedBrandId} />
            <button class="btn-ghost field-btn" onclick={generateNumbers} disabled={!selectedBrandId || isLoadingNumbers} title="Neue Bestellnummer generieren">
              Neu
            </button>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="field-label" for="gen-date">Datum</label>
        <input id="gen-date" type="date" bind:value={date} />
      </div>

      <div class="section-label">Kunde</div>
      <div class="field">
        <label class="field-label" for="gen-cust-name">Name</label>
        <input id="gen-cust-name" type="text" bind:value={customerName} />
      </div>
      <div class="field">
        <label class="field-label" for="gen-cust-addr">Adresse</label>
        <input id="gen-cust-addr" type="text" bind:value={customerAddress} />
      </div>
      <div class="field-row">
        <div class="field field-flex">
          <label class="field-label" for="gen-cust-city">Stadt</label>
          <input id="gen-cust-city" type="text" bind:value={customerCity} />
        </div>
        <div class="field" style="width:120px;flex-shrink:0;">
          <label class="field-label" for="gen-cust-zip">PLZ</label>
          <input id="gen-cust-zip" type="text" bind:value={customerZip} />
        </div>
      </div>
      <div class="field">
        <label class="field-label" for="gen-cust-country">Land</label>
        <input id="gen-cust-country" type="text" bind:value={customerCountry} style="width:80px;" />
      </div>

      <div class="section-label">Produkte</div>
      <div class="products-list">
        {#each products as product, i (i)}
          <div class="product-card card" class:selected={selectedProductIndex === i} data-product-card={i}>
            <div class="product-main">
              <div class="product-img">
                {#if product.image_url}
                  <img src={product.image_url} alt={product.name || 'Produkt'} />
                {:else if product.image_local_path}
                  <img src={`file://${product.image_local_path}`} alt={product.name || 'Produkt'} />
                {:else}
                  <div class="product-img-empty"></div>
                {/if}
              </div>
              <div class="product-fields">
                <input
                  type="text"
                  placeholder="Produktname"
                  value={product.name}
                  oninput={(e) => updateProduct(i, 'name', (e.target as HTMLInputElement).value)}
                />
                <div class="product-detail-row">
                  <input
                    type="text"
                    placeholder="Farbe"
                    value={product.color}
                    oninput={(e) => updateProduct(i, 'color', (e.target as HTMLInputElement).value)}
                    style="width:120px;"
                  />
                  <input
                    type="text"
                    placeholder="Größe"
                    value={product.size}
                    oninput={(e) => updateProduct(i, 'size', (e.target as HTMLInputElement).value)}
                    style="width:100px;"
                  />
                </div>
                <div class="product-detail-row">
                  <input
                    type="text"
                    inputmode="numeric"
                    placeholder="Menge"
                    value={product.quantity || ''}
                    oninput={(e) => updateProduct(i, 'quantity', parseInt((e.target as HTMLInputElement).value) || 1)}
                    style="width:80px;"
                  />
                  <input
                    type="text"
                    inputmode="decimal"
                    placeholder="Preis (€)"
                    value={product.price || ''}
                    oninput={(e) => updateProduct(i, 'price', parseNumberInput((e.target as HTMLInputElement).value))}
                    style="width:110px;"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Bild-URL"
                  value={product.image_url}
                  oninput={(e) => updateProduct(i, 'image_url', (e.target as HTMLInputElement).value)}
                  style="font-size:11px;"
                />
              </div>
              <div class="product-right">
                <span class="product-line-total">{formatPrice(product.price * product.quantity, currency)}</span>
                <button class="btn-icon" onclick={() => removeProduct(i)} title="Produkt entfernen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
        {#if products.length === 0}
          <div class="empty-products">
            <p>Keine Produkte. Importiere per URL/EML oder füge manuell hinzu.</p>
          </div>
        {/if}
      </div>

      <div class="field">
        <label class="field-label" for="gen-shipping">Versand (€)</label>
        <input
          id="gen-shipping"
          type="text"
          inputmode="decimal"
          placeholder="0,00"
          value={shipping || ''}
          oninput={(e) => shipping = parseNumberInput((e.target as HTMLInputElement).value)}
          style="width:120px;"
        />
      </div>

      <div class="totals-box">
        <div class="total-row">
          <span>Zwischensumme</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <div class="total-row">
          <span>MwSt ({taxRate}%)</span>
          <span>{formatPrice(taxAmount, currency)}</span>
        </div>
        <div class="total-row total-row-bold">
          <span>Gesamt</span>
          <span>{formatPrice(total, currency)}</span>
        </div>
      </div>

      <div class="field">
        <label class="field-label" for="gen-payment">Zahlung</label>
        <select id="gen-payment" bind:value={paymentMethod}>
          <option value="PAYPAL">PAYPAL</option>
          <option value="VISA">VISA</option>
          <option value="MASTERCARD">MASTERCARD</option>
          <option value="AMEX">AMEX</option>
          <option value="BANKÜBERWEISUNG">BANKÜBERWEISUNG</option>
          <option value="APPLE_PAY">APPLE PAY</option>
          <option value="GOOGLE_PAY">GOOGLE PAY</option>
        </select>
      </div>

      <button class="btn-primary save-btn" onclick={saveReceipt} disabled={!selectedBrandId}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
        Speichern
      </button>
    </div>

    <div class="right-panel">
      {#if previewHtml}
        <div class="mail-client" class:mail-dark={mailTheme === 'dark'} style="color-scheme: {mailTheme};">
          <!-- Outlook Chrome: Toolbar -->
          <div class="mail-toolbar">
            <div class="mail-toolbar-left">
              <button class="mail-tb-btn" title="Antworten">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button class="mail-tb-btn" title="Allen antworten">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>
              </button>
              <button class="mail-tb-btn" title="Weiterleiten">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 3L15 10"/><path d="M22 3L15 3"/><path d="M22 3L22 10"/><path d="M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>
              </button>
              <span class="mail-tb-sep"></span>
              <button class="mail-tb-btn" title="Löschen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
              <span class="mail-tb-sep"></span>
              <button class="mail-tb-btn" onclick={() => mailTheme = mailTheme === 'light' ? 'dark' : 'light'} title="{mailTheme === 'light' ? 'Dark Mode' : 'Light Mode'}">
                {#if mailTheme === 'light'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                {:else}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                {/if}
              </button>
            </div>
            <div class="mail-toolbar-right">
              <span class="mail-theme-label">{mailTheme === 'light' ? 'Hell' : 'Dunkel'}</span>
            </div>
          </div>
          <!-- Email Header (From, Subject, Date) -->
          <div class="mail-header">
            <div class="mail-sender-row">
              <div class="mail-avatar">{selectedBrand?.name?.[0] || 'A'}</div>
              <div class="mail-sender-info">
                <span class="mail-sender-name">{selectedBrand?.name || 'Arc\'teryx'}</span>
                <span class="mail-sender-email">&lt;noreply@{selectedBrand?.website_url?.replace('https://', '')?.replace('www.', '') || 'arcteryx.com'}&gt;</span>
              </div>
              <span class="mail-date">{date}</span>
            </div>
            <div class="mail-subject">
              Deine {selectedBrand?.name || 'Arc\'teryx'} Rechnung #{receiptNumber}
            </div>
          </div>
          <!-- Receipt Body -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="mail-body" style="color-scheme: {mailTheme};" onclick={handleMailBodyClick} role="region" aria-label="Receipt preview">
            {@html previewHtml}
          </div>
        </div>
      {:else}
        <div class="preview-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
            <line x1="7" y1="2" x2="7" y2="22"/>
            <line x1="17" y1="2" x2="17" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="2" y1="7" x2="7" y2="7"/>
            <line x1="2" y1="17" x2="7" y2="17"/>
            <line x1="17" y1="7" x2="22" y2="7"/>
            <line x1="17" y1="17" x2="22" y2="17"/>
          </svg>
          <p>Keine Live-Vorschau</p>
          <span>
            {#if !selectedBrand}
              Wähle eine Marke aus, um die Vorschau zu sehen.
            {:else if !selectedBrand.template_html}
              Diese Marke hat kein Template. Erstelle eines unter <strong>Marken verwalten</strong>.
            {:else}
              Füge Produkte hinzu, um die Vorschau zu aktualisieren.
            {/if}
          </span>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .generate-page {
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }

  .import-bar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }

  .import-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .import-row input {
    flex: 1;
    min-width: 200px;
  }

  .import-row .btn-secondary {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .import-row .btn-secondary.active {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .ai-btn {
    background: var(--accent-purple) !important;
    color: #fff !important;
    border: none !important;
  }

  .ai-btn:hover {
    opacity: 0.85;
  }

  .cart-btn {
    background: var(--accent-success) !important;
    color: #fff !important;
    border: none !important;
  }

  .cart-btn:hover {
    opacity: 0.85;
  }

  .cart-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .paste-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    flex-shrink: 0;
  }

  .paste-area textarea {
    width: 100%;
    resize: vertical;
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
  }

  .paste-actions {
    display: flex;
    gap: 8px;
  }

  .editor-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    overflow: hidden;
    min-height: 0;
  }

  .left-panel {
    overflow-y: auto;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .right-panel {
    overflow: hidden;
    display: flex;
    border-radius: 8px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-flex {
    flex: 1;
    min-width: 0;
  }

  .field-row {
    display: flex;
    gap: 10px;
  }

  .field-with-btn {
    display: flex;
    gap: 4px;
  }

  .field-with-btn input {
    flex: 1;
    min-width: 0;
  }

  .field-btn {
    font-size: 11px;
    padding: 4px 10px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .section-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--text-muted);
    font-weight: 600;
    margin-top: 6px;
    padding-bottom: 2px;
    border-bottom: 1px solid var(--border-muted);
  }

  .products-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .product-card {
    padding: 10px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-muted);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .product-card.selected {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 1px var(--accent-primary);
    background: var(--bg-secondary);
  }

  .product-main {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .product-img {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--bg-secondary);
    flex-shrink: 0;
  }

  .product-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .product-img-empty {
    width: 100%;
    height: 100%;
    background: var(--bg-hover);
  }

  .product-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .product-fields input {
    padding: 5px 8px;
    font-size: 12px;
  }

  .product-detail-row {
    display: flex;
    gap: 6px;
  }

  .product-detail-row input {
    padding: 5px 8px;
    font-size: 12px;
  }

  .product-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  .product-line-total {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }

  .empty-products {
    padding: 24px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
    border: 1px dashed var(--border-default);
    border-radius: 8px;
    background: var(--bg-tertiary);
  }

  .totals-box {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-default);
    border-radius: 6px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 2px 0;
    font-family: 'JetBrains Mono', monospace;
  }

  .total-row > span:first-child {
    color: var(--text-secondary);
  }

  .total-row > span:last-child {
    font-weight: 500;
  }

  .total-row-bold {
    font-weight: 600;
    font-size: 14px;
    border-top: 1px solid var(--border-default);
    margin-top: 2px;
    padding-top: 6px;
  }

  .total-row-bold > span {
    color: var(--text-primary) !important;
  }

  .save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 4px;
  }

  .save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* === Outlook Mail Client Chrome === */
  .mail-client {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    background: #ffffff;
    color: #1a1a1a;
  }

  .mail-client.mail-dark {
    background: #1c1c1c;
    color: #e0e0e0;
  }

  /* Toolbar */
  .mail-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;
    min-height: 40px;
  }

  .mail-dark .mail-toolbar {
    background: #2d2d2d;
    border-color: #3d3d3d;
  }

  .mail-toolbar-left {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .mail-toolbar-right {
    display: flex;
    align-items: center;
  }

  .mail-tb-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: #555;
    cursor: pointer;
  }

  .mail-tb-btn:hover {
    background: #e0e0e0;
    color: #1a1a1a;
  }

  .mail-dark .mail-tb-btn {
    color: #aaa;
  }

  .mail-dark .mail-tb-btn:hover {
    background: #3d3d3d;
    color: #fff;
  }

  .mail-tb-sep {
    width: 1px;
    height: 20px;
    background: #d0d0d0;
    margin: 0 4px;
  }

  .mail-dark .mail-tb-sep {
    background: #3d3d3d;
  }

  .mail-theme-label {
    font-size: 11px;
    font-weight: 500;
    color: #888;
    padding: 0 8px;
  }

  /* Email Header */
  .mail-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid #e8e8e8;
    flex-shrink: 0;
  }

  .mail-dark .mail-header {
    border-color: #333;
  }

  .mail-sender-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .mail-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #1a1a1a;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .mail-dark .mail-avatar {
    background: #e0e0e0;
    color: #1a1a1a;
  }

  .mail-sender-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .mail-sender-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .mail-dark .mail-sender-name {
    color: #e0e0e0;
  }

  .mail-sender-email {
    font-size: 11px;
    color: #888;
    margin-top: 1px;
  }

  .mail-date {
    font-size: 12px;
    color: #888;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .mail-subject {
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
    margin-top: 2px;
  }

  .mail-dark .mail-subject {
    color: #e0e0e0;
  }

  /* Mail Body (contains the actual receipt) */
  .mail-body {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .mail-body :global(table) {
    margin: 0 auto;
  }

  /* === End Mail Client === */

  .preview-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    padding: 32px;
    text-align: center;
  }

  .preview-empty p {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .preview-empty span {
    font-size: 13px;
    max-width: 280px;
    line-height: 1.5;
  }
</style>
