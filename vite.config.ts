// // vite.config.ts - VERSÃO SIMPLES E CORRETA

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     // Vamos manter o alias para 'src', é uma boa prática
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// --- ADICIONE ESTAS DUAS LINHAS ---
import path from 'path'
import { fileURLToPath } from 'url'
// ------------------------------------

// --- E ADICIONE ESTA LINHA TAMBÉM ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ------------------------------------

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/*',
          dest: 'public'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      // Agora o 'path' e o '__dirname' são reconhecidos
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // ... resto da configuração
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
