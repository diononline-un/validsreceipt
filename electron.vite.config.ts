import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: join(__dirname, 'electron/main/index.ts')
      },
      rollupOptions: {
        external: ['better-sqlite3']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: join(__dirname, 'electron/preload/index.ts')
      }
    }
  },
  renderer: {
    root: join(__dirname, 'src'),
    plugins: [svelte()],
    build: {
      rollupOptions: {
        input: {
          index: join(__dirname, 'src/app.html')
        }
      }
    },
    resolve: {
      alias: {
        '@': join(__dirname, 'src')
      }
    }
  }
})
