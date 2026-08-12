<script lang="ts">
  import { onMount } from 'svelte'
  import { currentRoute, navigate } from '../lib/router.svelte.ts'
  import type { ReceiptWithItems } from '../lib/types'
  import { formatPrice, formatDate, formatDateLong } from '../lib/utils'
  import { renderTemplate } from '../lib/template-engine'

  function buildTemplateData(r: ReceiptWithItems) {
    return {
      receipt_number: r.receipt_number,
      order_number: r.order_number,
      vat_id: r.brand?.vat_id || '',
      date: formatDateLong(r.date),
      customer_name: r.customer_name,
      customer_name_first: r.customer_name.split(' ')[0] || r.customer_name,
      customer_address: r.customer_address,
      customer_city: r.customer_city,
      customer_zip: r.customer_zip,
      customer_country: r.customer_country,
      subtotal: (r.subtotal || 0).toFixed(2).replace('.', ',') + ' \u20AC',
      shipping: (r.shipping || 0).toFixed(2).replace('.', ',') + ' \u20AC',
      tax_rate: (r.tax_rate || 19).toFixed(2).replace('.', ',') + '%',
      tax_amount: (r.tax_amount || 0).toFixed(2).replace('.', ',') + ' \u20AC',
      total: (r.total || 0).toFixed(2).replace('.', ',') + ' \u20AC',
      payment_method: r.payment_method || 'PAYPAL',
      currency: r.currency || 'EUR',
      products: r.items.map(item => ({
        name: item.name,
        image_url: item.image_url || '',
        image_local_path: item.image_local_path,
        color: item.color || '',
        size: item.size || '',
        quantity: item.quantity,
        price: item.unit_price,
        line_total: item.unit_price * item.quantity
      }))
    }
  }

  let receipt: ReceiptWithItems | null = $state(null)
  let loading = $state(true)
  let screenshotPath = $state<string | null>(null)

  const receiptId = $derived(parseInt($currentRoute.split('/')[2] || '0'))

  onMount(async () => {
    if (receiptId) {
      receipt = await window.api.getReceipt(receiptId)
    }
    loading = false
  })

  async function takeScreenshot() {
    if (!receipt) return
    const brand = receipt.brand
    const template = brand?.template_html
    if (!template) return
    const html = renderTemplate(template, buildTemplateData(receipt))
    const path = await window.api.captureScreenshot(html, receipt.id)
    screenshotPath = path
  }

  async function exportPNG() {
    if (!screenshotPath && receipt) {
      await takeScreenshot()
    }
    if (screenshotPath) {
      const savePath = await window.api.saveFileDialog({
        defaultPath: `receipt_${receipt?.receipt_number || 'export'}.png`,
        filters: [{ name: 'PNG', extensions: ['png'] }]
      })
      if (savePath) {
        // Copy file
        const data = await window.api.readFile(screenshotPath!)
        await window.api.writeFile(savePath, data)
      }
    }
  }

  async function deleteReceipt() {
    if (!receiptId) return
    await window.api.deleteReceipt(receiptId)
    navigate('/')
  }
</script>

{#if loading}
  <div class="empty-state"><p>Lade Beleg...</p></div>
{:else if !receipt}
  <div class="empty-state"><h3>Beleg nicht gefunden</h3></div>
{:else}
  <div class="page">
    <div class="page-header">
      <div>
        <button class="btn-ghost" style="margin-bottom:8px;padding:4px 0;" onclick={() => navigate('/')}>
          ← Zurück
        </button>
        <h1>Beleg {receipt.receipt_number}</h1>
        <p class="subtitle">{receipt.brand?.name || 'Unbekannt'} · {formatDate(receipt.date)}</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-danger" onclick={deleteReceipt}>Löschen</button>
        <button class="btn-secondary" onclick={takeScreenshot}>Screenshot</button>
        {#if screenshotPath}
          <button class="btn-primary" onclick={exportPNG}>Export PNG</button>
        {/if}
      </div>
    </div>

    <div class="receipt-viewer">
      <div class="receipt-details card" style="margin-bottom:16px;">
        <div class="detail-grid">
          <div class="detail-block">
            <strong>Rechnungsdaten</strong>
            <div class="detail-row"><span>Rechnung Nr.</span><span class="mono">{receipt.receipt_number}</span></div>
            <div class="detail-row"><span>Bestellnummer</span><span class="mono">{receipt.order_number}</span></div>
            <div class="detail-row"><span>Datum</span><span>{receipt.date}</span></div>
            <div class="detail-row"><span>MwSt</span><span>{receipt.tax_rate}%</span></div>
          </div>
          <div class="detail-block">
            <strong>Kunde</strong>
            <div class="detail-row"><span>Name</span><span>{receipt.customer_name}</span></div>
            <div class="detail-row"><span>Adresse</span><span>{receipt.customer_address}</span></div>
            <div class="detail-row"><span>Ort</span><span>{receipt.customer_city}, {receipt.customer_zip} {receipt.customer_country}</span></div>
            <div class="detail-row"><span>Zahlung</span><span>{receipt.payment_method}</span></div>
          </div>
        </div>
      </div>

      <!-- Receipt Render -->
      <div class="preview-wrapper">
        {#if receipt.brand?.template_html}
          {@html renderTemplate(receipt.brand.template_html, buildTemplateData(receipt))}
        {:else}
          <div class="empty-state"><p>Kein Template für diese Marke hinterlegt.</p></div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
  .subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }

  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
  }

  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .detail-block strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px; }
  .detail-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
  .detail-row span:first-child { color: var(--text-secondary); }

  .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

  .preview-wrapper {
    background: white; color: #1a1a1a; border-radius: 8px;
    overflow: hidden; max-height: 800px; overflow-y: auto;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }
</style>
