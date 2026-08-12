<script lang="ts">
  import { currentRoute } from './lib/router.svelte.ts'
  import Sidebar from './components/ui/Sidebar.svelte'
  import Dashboard from './routes/Dashboard.svelte'
  import Generate from './routes/Generate.svelte'
  import Brands from './routes/Brands.svelte'
  import BrandEdit from './routes/BrandEdit.svelte'
  import ReceiptDetail from './routes/ReceiptDetail.svelte'
</script>

<div class="app-layout">
  <Sidebar />
  <main class="main-content">
    {#if $currentRoute === '/'}
      <Dashboard />
    {:else if $currentRoute === '/generate'}
      <Generate />
    {:else if $currentRoute === '/brands'}
      <Brands />
    {:else if $currentRoute.startsWith('/brands/')}
      <BrandEdit />
    {:else if $currentRoute.startsWith('/receipts/')}
      <ReceiptDetail />
    {:else}
      <div class="empty-state">
        <h3>404</h3>
        <p>Seite nicht gefunden</p>
      </div>
    {/if}
  </main>
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
  }
  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    min-width: 0;
  }
</style>
