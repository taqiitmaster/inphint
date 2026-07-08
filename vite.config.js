import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, the API runs on :3001 (Express). Proxy /api there so the frontend
// can always call same-origin '/api/...'. In production the Express server
// serves both the built site and the API, so no proxy is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
