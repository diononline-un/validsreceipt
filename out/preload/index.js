"use strict";
const electron = require("electron");
const api = {
  // Brands
  getBrands: () => electron.ipcRenderer.invoke("db:get-brands"),
  getBrand: (id) => electron.ipcRenderer.invoke("db:get-brand", id),
  createBrand: (data) => electron.ipcRenderer.invoke("db:create-brand", data),
  updateBrand: (id, data) => electron.ipcRenderer.invoke("db:update-brand", id, data),
  deleteBrand: (id) => electron.ipcRenderer.invoke("db:delete-brand", id),
  // Receipts
  getReceipts: () => electron.ipcRenderer.invoke("db:get-receipts"),
  getReceipt: (id) => electron.ipcRenderer.invoke("db:get-receipt", id),
  saveReceipt: (data) => electron.ipcRenderer.invoke("db:save-receipt", data),
  deleteReceipt: (id) => electron.ipcRenderer.invoke("db:delete-receipt", id),
  // Numbers
  getNextReceiptNumber: (brandId) => electron.ipcRenderer.invoke("db:get-next-receipt-number", brandId),
  getNextOrderNumber: (brandId) => electron.ipcRenderer.invoke("db:get-next-order-number", brandId),
  // Selectors
  getBrandSelectors: (brandId) => electron.ipcRenderer.invoke("db:get-brand-selectors", brandId),
  saveBrandSelectors: (brandId, urlPattern, selectors) => electron.ipcRenderer.invoke("db:save-brand-selectors", brandId, urlPattern, selectors),
  // Seed
  seedArcteryx: () => electron.ipcRenderer.invoke("db:seed-arcteryx"),
  // EML Parser
  parseEML: (filePath) => electron.ipcRenderer.invoke("parse:eml", filePath),
  parseEMLAI: (filePath) => electron.ipcRenderer.invoke("parse:eml:ai", filePath),
  parseHtml: (html) => electron.ipcRenderer.invoke("parse:html", html),
  // AI Features
  aiParseReceiptHtml: (html) => electron.ipcRenderer.invoke("ai:parse-receipt-html", html),
  aiDetectSelectors: (pageContent) => electron.ipcRenderer.invoke("ai:detect-selectors", pageContent),
  aiTrainTemplate: (sampleHtml) => electron.ipcRenderer.invoke("ai:train-template", sampleHtml),
  // URL Scraper
  scrapeURL: (url) => electron.ipcRenderer.invoke("scrape:url", url),
  // Cart Scraper (Brave profile)
  scrapeCart: (cartUrl) => electron.ipcRenderer.invoke("scrape:cart", cartUrl ?? null),
  // Screenshot
  captureScreenshot: (html, receiptId) => electron.ipcRenderer.invoke("screenshot:receipt", html, receiptId),
  // App
  getVersion: () => electron.ipcRenderer.invoke("app:get-version"),
  // Dialogs
  openFileDialog: (filters) => electron.ipcRenderer.invoke("dialog:open-file", { filters }),
  saveFileDialog: (options) => electron.ipcRenderer.invoke("dialog:save-file", options || {}),
  // File operations
  readFile: (filePath) => electron.ipcRenderer.invoke("file:read", filePath),
  writeFile: (filePath, data) => electron.ipcRenderer.invoke("file:write", filePath, data)
};
electron.contextBridge.exposeInMainWorld("api", api);
