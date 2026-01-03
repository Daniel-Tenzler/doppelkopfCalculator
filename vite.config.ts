import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: process.env.TAURI_PLATFORM ? 'dist-tauri' : 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: process.env.TAURI_PLATFORM ? '127.0.0.1' : 'localhost',
  },
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_'],
})
