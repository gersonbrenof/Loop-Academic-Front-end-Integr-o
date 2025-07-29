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
    host: '0.0.0.0',         // Permite acesso externo
    port: 5173,              // Porta padrão Vite
    strictPort: true,        // Se a porta estiver ocupada, falha em vez de usar outra porta
    cors: true,              // Permite requisições CORS, útil para APIs externas e frontend separado
    open: true,              // Abre automaticamente no navegador ao iniciar
    // allowedHosts: ['loop-academic-front.onrender.com'], 
    // Se você quer restringir a hosts específicos, mantenha, caso contrário, pode comentar para aceitar todos
  },
  base: './', // Base relativa para assets em produção
})
