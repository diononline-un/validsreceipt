import { BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

export async function captureReceiptScreenshot(
  html: string,
  receiptId: number,
  dataDir: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const win = new BrowserWindow({
      width: 640,
      height: 2000,
      show: false,
      webPreferences: {
        offscreen: true,
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    win.webContents.on('did-finish-load', async () => {
      try {
        await new Promise(r => setTimeout(r, 2000))

        const screenshotDir = path.join(dataDir, 'screenshots')
        if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true })

        const bodyHeight = await win.webContents.executeJavaScript('document.body.scrollHeight')
        const contentHeight = Math.min(Math.max(bodyHeight as number, 600), 8000)

        win.setSize(640, contentHeight + 20)
        await new Promise(r => setTimeout(r, 500))

        const image = await win.webContents.capturePage({ x: 0, y: 0, width: 640, height: contentHeight })
        const filename = `receipt_${receiptId}_${Date.now()}.png`
        const filepath = path.join(screenshotDir, filename)

        fs.writeFileSync(filepath, image.toPNG())

        try {
          execSync(`convert "${filepath}" -strip "${filepath}"`, { stdio: 'ignore' })
        } catch { /* ImageMagick optional */ }

        win.close()
        resolve(filepath)
      } catch (err) {
        win.close()
        reject(err)
      }
    })

    win.webContents.on('did-fail-load', (_e, _code, _desc, url) => {
      win.close()
      reject(new Error(`Failed to load receipt: ${url}`))
    })
  })
}
