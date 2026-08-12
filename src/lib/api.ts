import type {
  Brand,
  NewBrand,
  NewReceiptData,
  ScrapedProduct,
  ReceiptWithItems,
  BrandSelector
} from './types'

declare global {
  interface Window {
    api: {
      getBrands(): Promise<Brand[]>
      getBrand(id: number): Promise<Brand | undefined>
      createBrand(data: NewBrand): Promise<Brand>
      updateBrand(id: number, data: Partial<NewBrand>): Promise<Brand>
      deleteBrand(id: number): Promise<{ success: boolean }>

      getReceipts(): Promise<ReceiptWithItems[]>
      getReceipt(id: number): Promise<ReceiptWithItems | undefined>
      saveReceipt(data: NewReceiptData): Promise<{ id: number }>
      deleteReceipt(id: number): Promise<{ success: boolean }>

      getNextReceiptNumber(brandId: number): Promise<string>
      getNextOrderNumber(brandId: number): Promise<string>

      getBrandSelectors(brandId: number): Promise<BrandSelector[]>
      saveBrandSelectors(brandId: number, urlPattern: string, selectors: any): Promise<{ success: boolean }>

      seedArcteryx(): Promise<Brand>

      parseEML(filePath: string): Promise<any>
      parseEMLAI(filePath: string): Promise<any>
      parseHtml(html: string): Promise<any[]>
      aiParseReceiptHtml(html: string): Promise<Record<string, unknown> | null>
      aiDetectSelectors(pageContent: string): Promise<Record<string, unknown> | null>
      aiTrainTemplate(sampleHtml: string): Promise<Record<string, unknown> | null>
      scrapeURL(url: string): Promise<ScrapedProduct>
      scrapeCart(cartUrl?: string): Promise<ScrapedProduct[]>
      captureScreenshot(html: string, receiptId: number): Promise<string>

      getVersion(): Promise<string>
      openFileDialog(filters?: { name: string; extensions: string[] }[]): Promise<string | null>
      saveFileDialog(options?: { defaultPath?: string; filters?: { name: string; extensions: string[] }[] }): Promise<string | null>
      readFile(filePath: string): Promise<string>
      writeFile(filePath: string, data: string): Promise<{ success: boolean }>
    }
  }
}

export const api = typeof window !== 'undefined' ? window.api : null
