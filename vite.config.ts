import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // atalho opcional
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0', // <-- necessário para expor a porta na rede
    port: 5173,
  },
  // necessário para deploy de SPA com react-router
  base: './',
})
