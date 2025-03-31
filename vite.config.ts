import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import path from 'path';
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 7250,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'local-ssl/localhost+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'local-ssl/localhost+1.pem')),
    },
    proxy: {
      '/audio': {
        target: 'https://cdn.alexlenk.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/audio/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, HEAD'
          })
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        hashCharacters: 'base36'
      },
    },
  },
});
