import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),

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
