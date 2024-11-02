import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'webview/dired',
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: true,
    emptyOutDir: true,
    outDir: '../../dist/webview/dired',
    rollupOptions: {
      input: '/src/index.tsx',
      output: {
        entryFileNames: 'index.js',
      },
    },
  },
  resolve: {
    alias: {
      '@core': resolve('webview/core/src'),
      '@dired': resolve('webview/dired/src'),
      '@history': resolve('webview/history/src'),
      '@common': resolve('src/common'),
    },
  },
});
