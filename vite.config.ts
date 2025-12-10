import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '^/api/apod-proxy/.*': {
        target: 'https://apod.nasa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/apod-proxy/, ''),
      },
    },
  },
})