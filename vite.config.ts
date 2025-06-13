import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import pluginChecker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    pluginChecker({
      typescript: {
        tsconfigPath: "./tsconfig.json",
        buildMode: true,
      },
    }),
  ],
  server: {
    // Enable TypeScript error overlay
    hmr: {
      overlay: true,
    },
  },
  // Enable TypeScript error checking
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/index.js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names;
          const extType = info[info.length - 1];
          if (!extType) return "assets/[name].[ext]";
          if (/css/i.test(extType)) {
            return "assets/index.css";
          }
          if (/js/i.test(extType)) {
            return "assets/index.js";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
