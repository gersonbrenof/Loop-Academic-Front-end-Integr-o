import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // escuta em 0.0.0.0
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    allowedHosts: ['loop-academic-front.onrender.com'], // libera seu host
  },
})
