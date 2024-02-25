import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/extension.ts',
      formats: ['cjs'],
      fileName: 'extension',
    },
    emptyOutDir: false,
    rollupOptions: {
      external: ['vscode', 'path', 'fs', 'os'],
    },
  },
  resolve: {
    alias: {
      '@src': resolve('src'),
    },
  },
});
