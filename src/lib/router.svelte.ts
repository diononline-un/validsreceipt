import { writable, derived } from 'svelte/store'

export const currentRoute = writable(window.location.hash.replace('#', '') || '/')

function updateHash() {
  currentRoute.set(window.location.hash.replace('#', '') || '/')
}

window.addEventListener('hashchange', updateHash)
window.addEventListener('DOMContentLoaded', updateHash)

export function navigate(path: string) {
  window.location.hash = path
}
