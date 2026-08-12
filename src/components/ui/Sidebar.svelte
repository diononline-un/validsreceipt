<script lang="ts">
  import { currentRoute, navigate } from '../../lib/router.svelte.ts'

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'grid' },
    { path: '/generate', label: 'Generieren', icon: 'plus' },
    { path: '/brands', label: 'Marken', icon: 'tag' }
  ]

  function isActive(path: string): boolean {
    if (path === '/') return $currentRoute === '/'
    return $currentRoute.startsWith(path)
  }
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="logo-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    </div>
    <span class="logo-text">ValidsReceipt</span>
  </div>

  <nav class="sidebar-nav">
    {#each navItems as item}
      <button class="nav-item" class:active={isActive(item.path)} onclick={() => navigate(item.path)}>
        <span class="nav-icon">
          {#if item.icon === 'grid'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          {:else if item.icon === 'plus'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          {:else if item.icon === 'tag'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          {/if}
        </span>
        <span class="nav-label">{item.label}</span>
      </button>
    {/each}
  </nav>

  <div class="sidebar-footer">
    <span class="version">v1.0.0</span>
  </div>
</aside>

<style>
  .sidebar {
    width: 220px;
    height: 100%;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-default);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .sidebar-header {
    padding: 20px 16px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--border-muted);
  }

  .logo-icon {
    color: var(--accent-primary);
  }

  .logo-text {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    color: var(--text-secondary);
    font-size: 13px;
    transition: all 0.15s ease;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .nav-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .nav-item.active {
    background: rgba(88, 166, 255, 0.1);
    color: var(--accent-primary);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
  }

  .sidebar-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border-muted);
  }

  .version {
    font-size: 11px;
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
  }
</style>
