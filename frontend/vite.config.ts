import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Tailwind as a Vite plugin — no postcss config needed
  ],
  server: {
    port: 5173,
    // Proxy: any request to /api in development is forwarded to Kong.
    // This means our React code calls /api/tasks (no host), Vite forwards it.
    // In production (Docker/Nginx), we'll configure the same proxy there.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Kong proxy port
        changeOrigin: true,
      },
    },
  },
})
