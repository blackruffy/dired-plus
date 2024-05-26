import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'webview',
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
    outDir: '../dist/webview',
    rollupOptions: {
      input: '/src/index.tsx',
      output: {
        entryFileNames: 'index.js',
      },
    },
  },
  resolve: {
    alias: {
      '@src': resolve('webview/src'),
      '@common': resolve('src/common'),
    },
  },
});
