import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://ipas-gateway-dev.bps.go.id',
        changeOrigin: true,
      },
      '/ai': {
        target: 'https://ipas-engine-gateway-dev.bps.go.id',
        changeOrigin: true,
      }
    }
  }
})
