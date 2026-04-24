import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import path from 'path'

export default defineConfig({

  plugins: [devtools(), solidPlugin(), tailwindcss()],
  resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
       '@components': path.resolve(__dirname, './src/components'),
     }
  },
  server: {
    allowedHosts: ["vl2llv-2a00-1370-818a-5c94-14e8-e7a1-a128-9b5f.ru.tuna.am"],
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
    },
    
    
    
  },
  build: {
    target: 'esnext',
  },
});
