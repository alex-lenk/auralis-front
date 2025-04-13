import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import path from 'path';
// import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 7250,
/*    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'local-ssl/localhost+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'local-ssl/localhost+1.pem')),
    },*/
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
