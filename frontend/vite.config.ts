import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss()],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true
    },
    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true
      }
    }
    
  },
  build: {
    target: 'esnext',
  },
});
