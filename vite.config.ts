// vite.config.ts - VERSÃO SIMPLES E CORRETA

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Vamos manter o alias para 'src', é uma boa prática
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})