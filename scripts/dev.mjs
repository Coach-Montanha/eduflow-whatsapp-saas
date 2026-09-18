import { createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const portFlagIndex = process.argv.indexOf('--port')
const portArgument = portFlagIndex >= 0 ? process.argv[portFlagIndex + 1] : undefined
const port = Number(portArgument ?? process.env.PORT ?? 8080)
const root = process.cwd()

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

createServer((request, response) => {
  const requestPath = new URL(request.url ?? '/', 'http://localhost').pathname
  const relativePath = normalize(decodeURIComponent(requestPath)).replace(/^(\.\.(\/|\\|$))+/, '')
  let filePath = join(root, relativePath === '/' ? 'index.html' : relativePath)

  if (!existsSync(filePath)) filePath = join(root, 'index.html')

  response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream')
  createReadStream(filePath).pipe(response)
}).listen(port, '0.0.0.0', () => {
  console.log(`EduFlow preview available on port ${port}`)
})