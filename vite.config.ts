import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'
// import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    server: {
      port: Number(env.VITE_API_PORT || 3000),
      /*https: {
       key: fs.readFileSync(path.resolve(__dirname, 'local-ssl/localhost+1-key.pem')),
       cert: fs.readFileSync(path.resolve(__dirname, 'local-ssl/localhost+1.pem')),
       },*/
    },
    plugins: [
      react(),
      tailwindcss(),
      svgr(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          hashCharacters: 'base36',
        },
      },
    },
  }
})
