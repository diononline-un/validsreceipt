export function generateRandomNumber(prefix: string, length: number): string {
  const num = Math.floor(Math.random() * Math.pow(10, length))
  return prefix + String(num).padStart(length, '0')
}

export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(price)
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function parseNumberInput(value: string): number {
  return parseFloat(value.replace(',', '.')) || 0
}

export function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen) + '...'
}
