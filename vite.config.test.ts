import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/test/index.ts',
      formats: ['cjs'],
      fileName: '[name]',
    },
    minify: false,
    emptyOutDir: false,
    outDir: 'out/test',
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
