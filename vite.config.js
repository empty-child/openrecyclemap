import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";

import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: true,
    port: 5173,
    strictPort: true,
  }
});
