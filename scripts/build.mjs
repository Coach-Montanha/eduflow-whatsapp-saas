import { cp, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const outputDirectory = new URL('../dist/', import.meta.url)
const projectRoot = new URL('../', import.meta.url)

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })

const files = ['index.html', 'capacitor.config.json', 'manifest.json', 'service-worker.js']

for (const file of files) {
  const source = new URL(file, projectRoot)
  if (existsSync(source)) {
    await cp(source, new URL(file, outputDirectory))
  }
}

console.log('Built static application in dist/')