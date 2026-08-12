<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from '../lib/router.svelte.ts'
  import type { Brand, NewBrand } from '../lib/types'

  let brands: Brand[] = $state([])
  let showNewForm = $state(false)
  let newBrand: NewBrand = $state({
    name: '',
    website_url: '',
    vat_id: '',
    tax_rate: 19
  })

  onMount(async () => {
    brands = await window.api.getBrands()
  })

  async function createBrand() {
    if (!newBrand.name.trim()) return
    const brand = await window.api.createBrand(newBrand)
    brands = [...brands, brand]
    newBrand = { name: '', website_url: '', vat_id: '', tax_rate: 19 }
    showNewForm = false
  }

  async function deleteBrand(id: number) {
    await window.api.deleteBrand(id)
    brands = brands.filter(b => b.id !== id)
  }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h1>Marken</h1>
      <p class="subtitle">Brand-Templates verwalten</p>
    </div>
    <button class="btn-primary" onclick={() => showNewForm = !showNewForm}>
      {showNewForm ? 'Abbrechen' : '+ Neue Marke'}
    </button>
  </div>

  {#if showNewForm}
    <div class="card" style="margin-bottom:16px;">
      <h3>Neue Marke</h3>
      <div class="form-grid" style="margin-top:12px;">
        <div class="field">
          <span class="field-label">Name *</span>
          <input type="text" placeholder="z.B. Otto, Nike" bind:value={newBrand.name} />
        </div>
        <div class="field">
          <span class="field-label">Website URL</span>
          <input type="text" placeholder="https://..." bind:value={newBrand.website_url} />
        </div>
        <div class="field">
          <span class="field-label">MwSt-ID</span>
          <input type="text" placeholder="DE123456789" bind:value={newBrand.vat_id} />
        </div>
        <div class="field">
          <span class="field-label">Steuersatz (%)</span>
          <input type="number" bind:value={newBrand.tax_rate} min="0" max="100" />
        </div>
      </div>
      <button class="btn-primary" style="margin-top:12px;" onclick={createBrand} disabled={!newBrand.name.trim()}>Erstellen</button>
    </div>
  {/if}

  {#if brands.length === 0}
    <div class="empty-state">
      <h3>Keine Marken</h3>
      <p>Füge deine erste Marke hinzu um Belege zu generieren.</p>
    </div>
  {:else}
    <div class="brand-list">
      {#each brands as brand}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="card card-hover brand-item" role="button" tabindex="0" onclick={() => navigate(`/brands/${brand.id}`)}>
          <div class="brand-info">
            <h3>{brand.name}</h3>
            <div class="brand-meta">
              {#if brand.website_url}
                <span class="meta-item">{brand.website_url}</span>
              {/if}
              {#if brand.vat_id}
                <span class="meta-item">MwSt: {brand.vat_id}</span>
              {/if}
              <span class="badge badge-default">Steuer {brand.tax_rate}%</span>
            </div>
          </div>
          <div class="brand-actions">
            <button class="btn-icon" title="Löschen" onclick={() => deleteBrand(brand.id)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
  }
  h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
  .subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .field { display: flex; flex-direction: column; gap: 4px; }

  .brand-list { display: flex; flex-direction: column; gap: 8px; }
  .brand-item { padding: 16px; display: flex; justify-content: space-between; align-items: center; }
  .brand-info h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .brand-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .meta-item { font-size: 11px; color: var(--text-muted); }
  .brand-actions { display: flex; gap: 4px; }

  .btn-primary[disabled] { opacity: 0.5; cursor: not-allowed; }
</style>
