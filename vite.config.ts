import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets',
          dest: 'src/' 
        }
      ]
    })
  ],
  server: {
    proxy: {
      '/chat': {
        target: 'https://api-dashboard.maot.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
