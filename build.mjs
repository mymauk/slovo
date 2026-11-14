import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import process from 'node:process'

const root = new URL('.', import.meta.url)
const envFile = new URL('.env', root)
const distDir = new URL('dist/', root)

function parseEnv(source) {
  const values = {}
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 1) continue
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    values[key] = value
  }
  return values
}

let fileValues = {}
try {
  fileValues = parseEnv(await readFile(envFile, 'utf8'))
} catch {}

const url = process.env.SUPABASE_URL || fileValues.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || fileValues.SUPABASE_PUBLISHABLE_KEY || fileValues.SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in .env or the build environment.')
}

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
  throw new Error('SUPABASE_URL must be the HTTPS URL for your Supabase project.')
}

let publicKey = key.startsWith('sb_publishable_')
if (!publicKey && key.split('.').length === 3) {
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8'))
    publicKey = payload.role === 'anon'
    if (payload.role === 'service_role') throw new Error('Do not use a service-role key in the website build.')
  } catch (error) {
    if (error.message.includes('service-role')) throw error
  }
}

if (!publicKey) {
  throw new Error('Use a Supabase publishable key or legacy anon key in the website build.')
}

await rm(distDir, { recursive: true, force: true })
await mkdir(distDir, { recursive: true })

for (const file of ['index.html', 'app.js', 'styles.css', 'favicon.svg']) {
  await cp(new URL(file, root), new URL(file, distDir))
}

const config = { url, key }
await writeFile(new URL('supabase-config.js', distDir), `window.SLOVO_SUPABASE_CONFIG = ${JSON.stringify(config)};\n`, 'utf8')
await writeFile(new URL('.nojekyll', distDir), '', 'utf8')
console.log('Static site files are ready in dist/.')

