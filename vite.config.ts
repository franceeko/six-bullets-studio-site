import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  build: {
    sourcemap: false,
    reportCompressedSize: false,
    cssCodeSplit: true,
  },
  plugins: [
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
    }),
    tailwindcss(),
    react(),
  ],
});
