import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'webview',
  plugins: [react()],
  build: {
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@src': resolve('webview/src'),
      '@common': resolve('src/common'),
    },
  },
});
