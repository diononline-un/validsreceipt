<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from '../lib/router.svelte.ts'
  import type { ReceiptWithItems } from '../lib/types'
  import { formatPrice, formatDate } from '../lib/utils'

  let receipts: ReceiptWithItems[] = $state([])
  let loading = $state(true)

  onMount(async () => {
    try {
      await window.api.seedArcteryx()
      receipts = await window.api.getReceipts()
    } catch (e) {
      console.error('Failed to load receipts:', e)
    }
    loading = false
  })

  async function deleteReceipt(id: number) {
    await window.api.deleteReceipt(id)
    receipts = receipts.filter(r => r.id !== id)
  }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h1>Dashboard</h1>
      <p class="subtitle">Gespeicherte Belege</p>
    </div>
    <button class="btn-primary" onclick={() => navigate('/generate')}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Neu erstellen
    </button>
  </div>

  {#if loading}
    <div class="empty-state">
      <p>Lade Belege...</p>
    </div>
  {:else if receipts.length === 0}
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <h3>Keine Belege vorhanden</h3>
      <p>Erstelle deinen ersten Beleg mit dem Generator oder importiere eine EML-Datei.</p>
      <button class="btn-primary" style="margin-top:16px;" onclick={() => navigate('/generate')}>Beleg erstellen</button>
    </div>
  {:else}
    <div class="receipt-list">
      {#each receipts as receipt}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="card card-hover receipt-card" role="button" tabindex="0" onclick={() => navigate(`/receipts/${receipt.id}`)}>
          <div class="receipt-card-header">
            <div>
              <h3>{receipt.brand?.name || 'Unbekannte Marke'}</h3>
              <span class="badge badge-default">{receipt.receipt_number}</span>
            </div>
            <div class="receipt-card-actions">
              <button class="btn-icon" title="Löschen" onclick={() => deleteReceipt(receipt.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
          <div class="receipt-card-info">
            <span>{formatDate(receipt.date)}</span>
            <span class="sep">|</span>
            <span>{receipt.items.length} Artikel</span>
            <span class="sep">|</span>
            <span class="receipt-amount">{formatPrice(receipt.total, receipt.currency)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }
  h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
  .subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
  .receipt-list { display: flex; flex-direction: column; gap: 8px; }
  .receipt-card { padding: 16px; }
  .receipt-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .receipt-card-header h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .receipt-card-actions { display: flex; gap: 4px; }
  .receipt-card-info { font-size: 12px; color: var(--text-secondary); display: flex; gap: 8px; align-items: center; }
  .sep { color: var(--border-default); }
  .receipt-amount { color: var(--accent-success); font-family: 'JetBrains Mono', monospace; font-weight: 500; }
</style>
