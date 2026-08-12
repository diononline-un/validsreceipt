import { mount } from 'svelte'
import App from './App.svelte'
import './app.css'

try {
  mount(App, {
    target: document.getElementById('app')!
  })
  console.log('[ValidsReceipt] App mounted successfully')
} catch (err) {
  console.error('[ValidsReceipt] Failed to mount app:', err)
  document.getElementById('app')!.innerHTML = `<div style="color:red;padding:20px;">App Error: ${(err as Error).message}</div>`
}
