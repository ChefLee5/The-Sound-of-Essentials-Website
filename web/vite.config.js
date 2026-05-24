import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Custom plugin to serve ebook files at /ebook/ path
function serveEbookPlugin() {
  const ebookDir = path.resolve(__dirname, '../ebook/OEBPS')
  return {
    name: 'serve-ebook',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let urlPath = req.url || ''
        if (!urlPath.startsWith('/ebook/')) return next()

        const relPath = urlPath.replace('/ebook/', '')
        const filePath = path.join(ebookDir, relPath)

        // Security: ensure it stays within ebookDir
        if (!filePath.startsWith(ebookDir)) return next()

        if (fs.existsSync(filePath)) {
          const ext = path.extname(filePath).toLowerCase()
          const mimeTypes = {
            '.xhtml': 'application/xhtml+xml',
            '.html': 'text/html',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
          }
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
        } else {
          res.statusCode = 404
          res.end('Not found')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveEbookPlugin()],
  base: '/',
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
