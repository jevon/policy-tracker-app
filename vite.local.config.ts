import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Config optimized for local file viewing
export default defineConfig({
  base: "./",
  build: {
    // Bundle everything into a single file
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}); 