<script lang="ts">
  import { onMount } from 'svelte'
  import { currentRoute, navigate } from '../lib/router.svelte.ts'
  import type { Brand, BrandSelector } from '../lib/types'

  let brand: Brand | null = $state(null)
  let selectors: BrandSelector[] = $state([])
  let editingName = $state('')
  let editingWebsite = $state('')
  let editingVatId = $state('')
  let editingTaxRate = $state(19)
  let newSelectorUrl = $state('')
  let newSelectorNameSel = $state('')
  let newSelectorPriceSel = $state('')
  let newSelectorImageSel = $state('')
  let saved = $state(false)
  let pasteSampleHtml = $state('')
  let isTraining = $state(false)
  let showTemplate = $state(false)
  let editingTemplate = $state('')

  const brandId = $derived(parseInt($currentRoute.split('/')[2] || '0'))

  onMount(async () => {
    if (brandId) {
      brand = await window.api.getBrand(brandId)
      if (brand) {
        editingName = brand.name
        editingWebsite = brand.website_url
        editingVatId = brand.vat_id
        editingTaxRate = brand.tax_rate
        editingTemplate = brand.template_html || ''
      }
      selectors = await window.api.getBrandSelectors(brandId)
    }
  })

  async function save() {
    if (!brandId) return
    await window.api.updateBrand(brandId, {
      name: editingName,
      website_url: editingWebsite,
      vat_id: editingVatId,
      tax_rate: editingTaxRate
    })
    saved = true
    setTimeout(() => saved = false, 2000)
  }

  async function addSelector() {
    if (!newSelectorUrl || !brandId) return
    await window.api.saveBrandSelectors(brandId, newSelectorUrl, {
      product_name_sel: newSelectorNameSel,
      product_price_sel: newSelectorPriceSel,
      product_image_sel: newSelectorImageSel,
      product_options_sel: '{}'
    })
    selectors = await window.api.getBrandSelectors(brandId)
    newSelectorUrl = ''
    newSelectorNameSel = ''
    newSelectorPriceSel = ''
    newSelectorImageSel = ''
  }

  async function handleTrainTemplate() {
    if (!pasteSampleHtml.trim()) return
    isTraining = true
    try {
      const result = await window.api.aiTrainTemplate(pasteSampleHtml)
      if (result && result.template_html) {
        editingTemplate = result.template_html
        showTemplate = true
        pasteSampleHtml = ''
      }
    } catch (e) {
      console.error('Template training failed:', e)
    }
    isTraining = false
  }

  async function saveTemplate() {
    if (!brandId || !editingTemplate.trim()) return
    await window.api.updateBrand(brandId, { template_html: editingTemplate })
    saved = true
    setTimeout(() => saved = false, 2000)
  }

  async function deleteBrand() {
    if (!brandId) return
    await window.api.deleteBrand(brandId)
    navigate('/brands')
  }
</script>

{#if !brand}
  <div class="empty-state"><p>Marke nicht gefunden</p></div>
{:else}
  <div class="page">
    <div class="page-header">
      <div>
        <button class="btn-ghost" style="margin-bottom:8px;padding:4px 0;" onclick={() => navigate('/brands')}>
          ← Zurück zu Marken
        </button>
        <h1>{editingName || 'Marke bearbeiten'}</h1>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-danger" onclick={deleteBrand}>Löschen</button>
        <button class="btn-primary" onclick={save}>{saved ? 'Gespeichert ✓' : 'Speichern'}</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <h3>Allgemein</h3>
      <div class="form-grid" style="margin-top:12px;">
        <div class="field">
          <span class="field-label">Name</span>
          <input type="text" bind:value={editingName} />
        </div>
        <div class="field">
          <span class="field-label">Website URL</span>
          <input type="text" bind:value={editingWebsite} />
        </div>
        <div class="field">
          <span class="field-label">MwSt-ID</span>
          <input type="text" bind:value={editingVatId} />
        </div>
        <div class="field">
          <span class="field-label">Steuersatz (%)</span>
          <input type="number" bind:value={editingTaxRate} min="0" max="100" />
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <h3>Template trainieren (AI)</h3>
      <p style="color:var(--text-muted);font-size:12px;margin-top:4px;">Fuge HTML einer Bestell-E-Mail ein. Die AI erstellt automatisch ein Template mit {{platzhaltern}}.</p>
      
      <div style="margin-top:12px;">
        <textarea
          placeholder="HTML hier einfugen..."
          bind:value={pasteSampleHtml}
          rows="10"
          style="width:100%; resize:vertical; font-size:11px; font-family:monospace;"
        ></textarea>
        <div style="margin-top:8px; display:flex; gap:8px;">
          <button class="btn-primary" onclick={handleTrainTemplate} disabled={isTraining || !pasteSampleHtml.trim()} style="background:var(--accent-purple);">
            {isTraining ? 'Training...' : 'Template trainieren (AI)'}
          </button>
          <button class="btn-ghost" onclick={() => showTemplate = !showTemplate}>
            {showTemplate ? 'Template ausblenden' : 'Template anzeigen'}
          </button>
        </div>
      </div>

      {#if showTemplate}
        <div style="margin-top:12px;">
          <span style="font-size:11px;text-transform:uppercase;color:var(--text-muted);">Template HTML (bearbeitbar)</span>
          <textarea
            bind:value={editingTemplate}
            rows="20"
            style="width:100%; resize:vertical; font-size:10px; font-family:monospace; margin-top:4px;"
          ></textarea>
          <button class="btn-primary" style="margin-top:8px;" onclick={saveTemplate}>Template ubernehmen</button>
        </div>
      {/if}
    </div>

    <div class="card" style="margin-bottom:16px;">
      <h3>CSS Selektoren (für Auto-Scraping)</h3>
      <p style="color:var(--text-muted);font-size:12px;margin-top:4px;">Diese Selektoren werden verwendet um Produktinfos automatisch von URLs zu extrahieren.</p>

      <div class="form-grid" style="margin-top:12px;">
        <div class="field" style="grid-column:1/-1;">
          <span class="field-label">URL Pattern (mit * als Wildcard)</span>
          <input type="text" placeholder="*.arcteryx.com/*" bind:value={newSelectorUrl} />
        </div>
        <div class="field">
          <span class="field-label">Produktname Selector</span>
          <input type="text" placeholder="h1" bind:value={newSelectorNameSel} />
        </div>
        <div class="field">
          <span class="field-label">Preis Selector</span>
          <input type="text" placeholder=".product-price" bind:value={newSelectorPriceSel} />
        </div>
        <div class="field">
          <span class="field-label">Bild Selector</span>
          <input type="text" placeholder=".product-image img" bind:value={newSelectorImageSel} />
        </div>
        <div class="field">
          <button class="btn-primary" style="align-self:flex-end;" onclick={addSelector}>Selector hinzufügen</button>
        </div>
      </div>

      {#if selectors.length > 0}
        <div style="margin-top:16px;">
          <h4 style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">Gespeicherte Selektoren</h4>
          {#each selectors as sel}
            <div class="selector-item">
              <code>{sel.url_pattern}</code>
              <span class="badge badge-default">{sel.product_name_sel}</span>
            </div>
          {/each}
        </div>
      {:else}
        <p style="color:var(--text-muted);font-size:12px;margin-top:12px;">Noch keine Selektoren definiert.</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }

  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
  }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .field { display: flex; flex-direction: column; gap: 4px; }

  .selector-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; background: var(--bg-tertiary); border-radius: 6px;
    margin-top: 4px;
  }
  .selector-item code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent-primary); }
</style>
