import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Required because GitHub Pages serves this app from:
  // https://dlaredogethob.github.io/job-application-optimizer-1-/
  base: '/job-application-optimizer-1-/',

  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  build: {
    target: 'esnext',
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
});
