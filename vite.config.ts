import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names;
          const extType = info[info.length - 1];
          if (!extType) return 'assets/[name].[ext]';
          if (/css/i.test(extType)) {
            return 'assets/index.css';
          }
          if (/js/i.test(extType)) {
            return 'assets/index.js';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
})
