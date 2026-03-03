import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, proxy /api/gdelt-* to the real GDELT endpoints.
    // In production, Vercel serverless functions handle these routes.
    // Note: /api/newsdata is NOT proxied here — use `vercel dev` for local
    // NewsData.io testing (it requires the NEWSDATA_API_KEY env var).
    proxy: {
      '/api/gdelt-geo': {
        target: 'https://api.gdeltproject.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gdelt-geo/, '/api/v2/geo/geo'),
      },
      '/api/gdelt-doc': {
        target: 'https://api.gdeltproject.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gdelt-doc/, '/api/v2/doc/doc'),
      },
    },
  },
})
