import { contextBridge, ipcRenderer } from 'electron'
import type { Brand, NewBrand, NewReceiptData, ScrapedProduct, ReceiptWithItems, EMLParsedData, BrandSelector } from '../../src/lib/types'

const api = {
  // Brands
  getBrands: (): Promise<Brand[]> => ipcRenderer.invoke('db:get-brands'),
  getBrand: (id: number): Promise<Brand | undefined> => ipcRenderer.invoke('db:get-brand', id),
  createBrand: (data: NewBrand): Promise<Brand> => ipcRenderer.invoke('db:create-brand', data),
  updateBrand: (id: number, data: Partial<NewBrand>): Promise<Brand> => ipcRenderer.invoke('db:update-brand', id, data),
  deleteBrand: (id: number): Promise<{ success: boolean }> => ipcRenderer.invoke('db:delete-brand', id),

  // Receipts
  getReceipts: (): Promise<ReceiptWithItems[]> => ipcRenderer.invoke('db:get-receipts'),
  getReceipt: (id: number): Promise<ReceiptWithItems | undefined> => ipcRenderer.invoke('db:get-receipt', id),
  saveReceipt: (data: NewReceiptData): Promise<{ id: number }> => ipcRenderer.invoke('db:save-receipt', data),
  deleteReceipt: (id: number): Promise<{ success: boolean }> => ipcRenderer.invoke('db:delete-receipt', id),

  // Numbers
  getNextReceiptNumber: (brandId: number): Promise<string> => ipcRenderer.invoke('db:get-next-receipt-number', brandId),
  getNextOrderNumber: (brandId: number): Promise<string> => ipcRenderer.invoke('db:get-next-order-number', brandId),

  // Selectors
  getBrandSelectors: (brandId: number): Promise<BrandSelector[]> => ipcRenderer.invoke('db:get-brand-selectors', brandId),
  saveBrandSelectors: (brandId: number, urlPattern: string, selectors: any): Promise<{ success: boolean }> =>
    ipcRenderer.invoke('db:save-brand-selectors', brandId, urlPattern, selectors),

  // Seed
  seedArcteryx: (): Promise<Brand> => ipcRenderer.invoke('db:seed-arcteryx'),

  // EML Parser
  parseEML: (filePath: string): Promise<EMLParsedData & { receiptData: any }> => ipcRenderer.invoke('parse:eml', filePath),
  parseEMLAI: (filePath: string): Promise<EMLParsedData & { receiptData: any; aiEnhanced: boolean }> =>
    ipcRenderer.invoke('parse:eml:ai', filePath),
  parseHtml: (html: string): Promise<any[]> => ipcRenderer.invoke('parse:html', html),

  // AI Features
  aiParseReceiptHtml: (html: string): Promise<Record<string, unknown> | null> =>
    ipcRenderer.invoke('ai:parse-receipt-html', html),
  aiDetectSelectors: (pageContent: string): Promise<Record<string, unknown> | null> =>
    ipcRenderer.invoke('ai:detect-selectors', pageContent),
  aiTrainTemplate: (sampleHtml: string): Promise<Record<string, unknown> | null> =>
    ipcRenderer.invoke('ai:train-template', sampleHtml),

  // URL Scraper
  scrapeURL: (url: string): Promise<ScrapedProduct> => ipcRenderer.invoke('scrape:url', url),

  // Cart Scraper (Brave profile)
  scrapeCart: (cartUrl?: string): Promise<ScrapedProduct[]> => ipcRenderer.invoke('scrape:cart', cartUrl ?? null),

  // Screenshot
  captureScreenshot: (html: string, receiptId: number): Promise<string> => ipcRenderer.invoke('screenshot:receipt', html, receiptId),

  // App
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),

  // Dialogs
  openFileDialog: (filters?: { name: string; extensions: string[] }[]): Promise<string | null> =>
    ipcRenderer.invoke('dialog:open-file', { filters }),
  saveFileDialog: (options?: { defaultPath?: string; filters?: { name: string; extensions: string[] }[] }): Promise<string | null> =>
    ipcRenderer.invoke('dialog:save-file', options || {}),

  // File operations
  readFile: (filePath: string): Promise<string> => ipcRenderer.invoke('file:read', filePath),
  writeFile: (filePath: string, data: string): Promise<{ success: boolean }> => ipcRenderer.invoke('file:write', filePath, data)
}

contextBridge.exposeInMainWorld('api', api)

export type ValidsReceiptAPI = typeof api
