import puppeteer from 'puppeteer-core'
import type { Browser } from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { app } from 'electron'
import type { ScrapedProduct } from '../../src/lib/types'

let browser: Browser | null = null

function getChromiumPath(): string {
  const possiblePaths = [
    '/usr/bin/brave',
    '/usr/bin/brave-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/opt/brave.com/brave/brave',
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p
  }
  throw new Error('Kein Browser gefunden. Installiere Brave oder Chromium.')
}

function getBraveProfilePath(): string {
  const home = os.homedir()
  const possiblePaths = [
    path.join(home, '.config', 'BraveSoftware', 'Brave-Browser', 'Default'),
    path.join(home, '.config', 'BraveSoftware', 'Brave-Browser'),
    path.join(home, 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default'),
    path.join(home, '.config', 'google-chrome', 'Default'),
    path.join(home, '.config', 'chromium', 'Default'),
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p
  }
  return ''
}

async function getBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) return browser
  const profilePath = getBraveProfilePath()

  const launchArgs: string[] = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
  ]

  browser = await puppeteer.launch({
    executablePath: getChromiumPath(),
    headless: true,
    userDataDir: profilePath || undefined,
    args: launchArgs,
  })
  return browser
}

function resolveImagePath(filename: string): string {
  const baseDir = app.isPackaged
    ? path.join(app.getPath('userData'), 'data')
    : path.join(app.getAppPath(), 'data')
  const dir = path.join(baseDir, 'images')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return path.join(dir, filename)
}

export async function downloadImage(url: string, savePath: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to download image: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(savePath, buffer)
}

export async function scrapeProductUrl(url: string): Promise<ScrapedProduct> {
  const b = await getBrowser()
  const page = await b.newPage()

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('body', { timeout: 5000 }).catch(() => {})

    const result: ScrapedProduct = {
      name: '',
      price: 0,
      image_url: '',
    }

    // Try meta tags first
    result.name = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => '')
    if (!result.name) result.name = await page.$eval('meta[name="title"]', el => el.content).catch(() => '')
    if (!result.name) result.name = await page.title()
    result.name = result.name.split('|')[0].split('–')[0].split('-')[0].trim()

    // Price
    for (const sel of ['meta[property="product:price:amount"]', '[data-testid="price"]', '.product-price', '[class*="price"]', '[itemprop="price"]']) {
      const el = await page.$(sel)
      if (el) {
        const tag = await el.evaluate(e => e.tagName)
        const text = tag === 'META'
          ? await el.evaluate(e => (e as HTMLMetaElement).content)
          : await el.evaluate(e => (e as HTMLElement).innerText || '')
        const m = text.match(/(\d{1,6}(?:[,.]\d{2}))/)
        if (m) { result.price = parseFloat(m[1].replace(',', '.')); break }
      }
    }

    // Image - prefer og:image first
    for (const sel of ['meta[property="og:image"]', '[data-testid="product-image"]', '.product-image img', '.gallery img:first-child', 'main img', 'img[src*="product"]']) {
      const src = await page.$eval(sel, el => {
        if (el.tagName === 'META') return (el as HTMLMetaElement).content
        return (el as HTMLImageElement).src || ''
      }).catch(() => '')
      if (src && src.startsWith('http')) { result.image_url = src; break }
    }

    // Download
    if (result.image_url?.startsWith('http')) {
      const fname = `product_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.jpg`
      const savePath = resolveImagePath(fname)
      try { await downloadImage(result.image_url, savePath); result.image_local_path = savePath } catch {}
    }

    return result
  } finally {
    await page.close()
  }
}

/**
 * Scrapes a cart/checkout page and extracts ALL products with proper images.
 * Uses the user's Brave profile for authenticated sessions.
 */
export async function scrapeCart(cartUrl: string): Promise<ScrapedProduct[]> {
  const b = await getBrowser()
  const page = await b.newPage()

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.goto(cartUrl, { waitUntil: 'networkidle2', timeout: 45000 })
    await page.waitForSelector('body', { timeout: 5000 }).catch(() => {})

    // Small delay for JS-rendered carts
    await new Promise(r => setTimeout(r, 2000))

    const pageContent = await page.content()
    const pageUrl = page.url()
    const products: ScrapedProduct[] = []

    // ---- Strategy 1: Arcteryx cart page specific extraction ----
    const arcItems = await page.$$eval('[data-testid="cart-item"], .cart-item, [class*="cart-item"], [class*="CartItem"]', (items) =>
      items.map(el => {
        const name = (el.querySelector('[data-testid*="title"], .product-title, h3, h4, [class*="name"]') as HTMLElement)?.innerText?.trim() || ''
        const priceText = (el.querySelector('[data-testid*="price"], .price, [class*="price"]') as HTMLElement)?.innerText?.trim() || '0'
        const img = el.querySelector('img[src*="product"], img[src*="1350"], img') as HTMLImageElement
        const imgSrc = img?.src || img?.getAttribute('data-src') || ''
        const colorEl = el.querySelector('[class*="color"], [class*="swatch"], [class*="variant"]')
        const color = (colorEl as HTMLElement)?.innerText?.trim() || ''
        const sizeEl = el.querySelector('[class*="size"], select option:checked, [class*="Size"]')
        const size = (sizeEl as HTMLElement)?.innerText?.trim() || ''
        const qtyEl = el.querySelector('select[class*="qty"], [class*="quantity"], input[type="number"]') as HTMLInputElement
        const qty = parseInt(qtyEl?.value || '1') || 1
        const priceMatch = priceText.match(/(\d{1,6}(?:[,.]\d{2}))/)
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0
        return { name, price, color, size, quantity: qty, imageSrc: imgSrc }
      })
    )

    for (const item of arcItems) {
      if (item.name && item.price > 0) {
        const p: ScrapedProduct = {
          name: item.name,
          price: item.price,
          image_url: item.imageSrc || '',
        }
        if (item.color) p.options = { color: item.color }
        if (item.size) p.options = { ...p.options, size: item.size }

        if (p.image_url?.startsWith('http')) {
          const fname = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.jpg`
          const savePath = resolveImagePath(fname)
          try { await downloadImage(p.image_url, savePath); p.image_local_path = savePath } catch {}
        }
        products.push(p)
      }
    }

    // ---- Strategy 2: Generic image extraction from cart ----
    if (products.length === 0) {
      // Try to find product images and nearby text
      const allImgs = await page.$$eval('img[src*="1350x1710"], img[src*="product"], img[src*="F2"]', imgs =>
        imgs.map(img => {
          const src = (img as HTMLImageElement).src || (img as HTMLImageElement).getAttribute('data-src') || ''
          const alt = (img as HTMLImageElement).alt || ''
          // Try to find nearby product name
          let name = alt
          if (!name) {
            let el = img.parentElement
            for (let i = 0; i < 5 && el; i++) {
              const textEl = el.querySelector('h3, h4, [class*="title"], [class*="name"]')
              if (textEl) { name = (textEl as HTMLElement).innerText?.trim() || ''; break }
              el = el.parentElement
            }
          }
          return { src, name }
        }).filter(i => i.src.startsWith('http'))
      )

      for (const img of allImgs) {
        if (!products.find(p => p.image_url === img.src)) {
          products.push({ name: img.name || 'Produkt', price: 0, image_url: img.src })
        }
      }
    }

    // ---- Strategy 3: Try JSON-LD structured data ----
    if (products.length === 0) {
      const jsonld = await page.$$eval('script[type="application/ld+json"]', scripts =>
        scripts.map(s => {
          try { return JSON.parse(s.textContent || '{}') } catch { return {} }
        })
      )
      for (const ld of jsonld) {
        const items = ld['@graph'] || [ld]
        for (const item of items) {
          if (item['@type'] === 'Product' || item.name) {
            const p: ScrapedProduct = {
              name: item.name || '',
              price: parseFloat(item.offers?.price || '0') || 0,
              image_url: (Array.isArray(item.image) ? item.image[0] : item.image) || '',
            }
            if (p.name && !products.find(x => x.name === p.name)) {
              if (p.image_url?.startsWith('http')) {
                const fname = `ld_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.jpg`
                const savePath = resolveImagePath(fname)
                try { await downloadImage(p.image_url, savePath); p.image_local_path = savePath } catch {}
              }
              products.push(p)
            }
          }
        }
      }
    }

    // If nothing found, return page info
    if (products.length === 0) {
      return [{
        name: `Cart page: ${pageUrl.split('/').pop() || pageUrl}`,
        price: 0,
        image_url: '',
      }]
    }

    return products
  } finally {
    await page.close()
  }
}

/**
 * Scrapes Arcteryx's official cart endpoint or regular cart URL.
 * Auto-detects if we're on arcteryx.com and uses the correct approach.
 */
export async function scrapeArcteryxCart(): Promise<ScrapedProduct[]> {
  // Use the German cart URL as default
  return scrapeCart('https://arcteryx.com/de/de/cart')
}

export async function closeBrowser(): Promise<void> {
  if (browser) { await browser.close(); browser = null }
}
