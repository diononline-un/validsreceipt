import { ipcMain, dialog, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import type { IPCChannels, NewBrand, NewReceiptData, BrandSelector } from '../../src/lib/types'
import {
  initDatabase,
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllReceipts,
  getReceipt,
  saveReceipt,
  updateReceiptHtml,
  updateReceiptScreenshot,
  deleteReceipt,
  getNextReceiptNumber,
  getNextOrderNumber,
  getBrandSelectors,
  saveBrandSelector,
  seedArcteryx,
  closeDatabase
} from './db'
import { parseEMLFile, extractReceiptDataFromHtml } from './eml-parser'
import { scrapeProductUrl, scrapeCart, scrapeArcteryxCart } from './puppeteer'
import { captureReceiptScreenshot } from './screenshot'
import { aiParseReceiptHtml, aiDetectSelectors, aiEnhanceReceiptData, aiTrainTemplate } from './ai'
import { parsePastedHtml } from './html-parser'

export function registerIpcHandlers(): void {
  initDatabase()

  // Auto-seed Arcteryx
  seedArcteryx()

  // --- Brands ---
  ipcMain.handle('db:get-brands', () => getAllBrands())

  ipcMain.handle('db:get-brand', (_e, id: number) => getBrand(id))

  ipcMain.handle('db:create-brand', (_e, data: NewBrand) => createBrand(data))

  ipcMain.handle('db:update-brand', (_e, id: number, data: Partial<NewBrand>) => updateBrand(id, data))

  ipcMain.handle('db:delete-brand', (_e, id: number) => {
    deleteBrand(id)
    return { success: true }
  })

  // --- Receipts ---
  ipcMain.handle('db:get-receipts', () => getAllReceipts())

  ipcMain.handle('db:get-receipt', (_e, id: number) => getReceipt(id))

  ipcMain.handle('db:save-receipt', (_e, data: NewReceiptData) => {
    const id = saveReceipt(data)
    return { id }
  })

  ipcMain.handle('db:delete-receipt', (_e, id: number) => {
    deleteReceipt(id)
    return { success: true }
  })

  // --- Numbers ---
  ipcMain.handle('db:get-next-receipt-number', (_e, brandId: number) => getNextReceiptNumber(brandId))

  ipcMain.handle('db:get-next-order-number', (_e, brandId: number) => getNextOrderNumber(brandId))

  // --- Selectors ---
  ipcMain.handle('db:get-brand-selectors', (_e, brandId: number) => getBrandSelectors(brandId))

  ipcMain.handle('db:save-brand-selectors', (_e, brandId: number, urlPattern: string, selectors: Omit<BrandSelector, 'id' | 'brand_id' | 'url_pattern' | 'last_validated'>) => {
    saveBrandSelector(brandId, urlPattern, selectors)
    return { success: true }
  })

  // --- Seed ---
  ipcMain.handle('db:seed-arcteryx', () => seedArcteryx())

  // --- EML Parser ---
  ipcMain.handle('parse:eml', async (_e, filePath: string) => {
    const data = await parseEMLFile(filePath)
    const receiptData = extractReceiptDataFromHtml(data.htmlBody)
    return { ...data, receiptData }
  })

  // --- AI-Powered EML Parser ---
  ipcMain.handle('parse:eml:ai', async (_e, filePath: string) => {
    const data = await parseEMLFile(filePath)
    const regexResult = extractReceiptDataFromHtml(data.htmlBody)
    const enhanced = await aiEnhanceReceiptData(data.htmlBody, regexResult as Record<string, unknown>)
    return { ...data, receiptData: enhanced, aiEnhanced: true }
  })

  // --- AI Receipt HTML Parser ---
  ipcMain.handle('ai:parse-receipt-html', async (_e, html: string) => {
    return await aiParseReceiptHtml(html)
  })

  // --- AI Selector Detector ---
  ipcMain.handle('ai:detect-selectors', async (_e, pageContent: string) => {
    return await aiDetectSelectors(pageContent)
  })

  // --- URL Scraper ---
  ipcMain.handle('scrape:url', async (_e, url: string) => {
    return await scrapeProductUrl(url)
  })

  // --- Cart Scraper ---
  ipcMain.handle('scrape:cart', async (_e, cartUrl?: string) => {
    if (cartUrl && typeof cartUrl === 'string' && cartUrl.length > 5) {
      return await scrapeCart(cartUrl)
    }
    return await scrapeArcteryxCart()
  })

  // --- Screenshot ---
  ipcMain.handle('screenshot:receipt', async (_e, html: string, receiptId: number) => {
    const win = BrowserWindow.getFocusedWindow()
    const dataDir = win
      ? path.join(path.dirname((win as any).__dirname || ''), '..', 'data')
      : path.join(process.cwd(), 'data')
    return await captureReceiptScreenshot(html, receiptId, dataDir)
  })

  // --- App ---
  ipcMain.handle('app:get-version', () => '1.0.0')

  // --- File Dialogs ---
  ipcMain.handle('dialog:open-file', async (_e, options: { filters?: { name: string; extensions: string[] }[] }) => {
    const win = BrowserWindow.getFocusedWindow()
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openFile'],
      filters: options.filters || [{ name: 'Email Files', extensions: ['eml'] }]
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('dialog:save-file', async (_e, options: { defaultPath?: string; filters?: { name: string; extensions: string[] }[] }) => {
    const win = BrowserWindow.getFocusedWindow()
    const result = await dialog.showSaveDialog(win!, {
      defaultPath: options.defaultPath,
      filters: options.filters || [{ name: 'PNG Image', extensions: ['png'] }]
    })
    if (result.canceled || !result.filePath) return null
    return result.filePath
  })

  // --- File Operations ---
  ipcMain.handle('file:read', async (_e, filePath: string) => {
    return fs.readFileSync(filePath, 'utf-8')
  })

  ipcMain.handle('file:write', async (_e, filePath: string, data: string) => {
    fs.writeFileSync(filePath, data)
    return { success: true }
  })

  // --- AI Template Training ---
  ipcMain.handle('ai:train-template', async (_e, sampleHtml: string) => {
    return await aiTrainTemplate(sampleHtml)
  })

  // --- HTML Paste Parser ---
  ipcMain.handle('parse:html', (_e, html: string) => {
    return parsePastedHtml(html)
  })
}

export function unregisterIpcHandlers(): void {
  closeDatabase()
}
