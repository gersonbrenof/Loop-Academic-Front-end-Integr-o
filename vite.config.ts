import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: true,
  cors: true,
  open: true,
  allowedHosts: ['loop-academic-front.onrender.com'],  // só permite esse host
  },
  base: './', // Base relativa para assets em produção
})