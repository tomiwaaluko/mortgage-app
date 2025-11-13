import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Enable minification
    minify: "esbuild",
    // Generate sourcemaps for debugging
    sourcemap: false,
    // Optimize chunks
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "chakra-ui": ["@chakra-ui/react", "@chakra-ui/icons"],
          "form-libs": ["react-hook-form", "@hookform/resolvers", "yup"],
          animation: ["framer-motion"],
        },
        // Asset file names with hash for cache busting
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1] || "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better optimization
    target: "esnext",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
