import { defineConfig } from 'vite'

export default defineConfig({
  // Rapier ships as a WASM module — we need to allow it to be loaded.
  optimizeDeps: {
    exclude: ['@dimforge/rapier2d'],
  },
  server: {
    headers: {
      // Required for SharedArrayBuffer (used by some WASM modules)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
