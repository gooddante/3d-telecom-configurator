import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/3d-telecom-configurator/',
  root: 'src',
  publicDir: '../public',
  server: {
    open: true,
    port: 5173
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  },
  optimizeDeps: {
    include: ['three']
  }
}); 