import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const certDir = path.resolve(__dirname, 'certs')
const keyPath = path.join(certDir, 'localhost.key')
const certPath = path.join(certDir, 'localhost.crt')

function httpsConfig() {
  try {
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }
    }
  } catch (e) {
    // ignore and fall through to undefined
    console.error('Error reading cert files', e)
  }

  return undefined
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsConfig(),
    host: true,
  },
})
