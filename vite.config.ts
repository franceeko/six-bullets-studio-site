import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, type Plugin } from "vite";

const stripFirefoxCssWarnings = (): Plugin => ({
  name: "strip-firefox-css-warnings",
  generateBundle(_options, bundle) {
    for (const asset of Object.values(bundle)) {
      if (
        asset.type !== "asset" ||
        !asset.fileName?.endsWith(".css") ||
        typeof asset.source !== "string"
      ) {
        continue;
      }

      asset.source = asset.source.replace(/(?:-webkit-|-moz-)?text-size-adjust\s*:[^;]+;/gi, "");
    }
  },
});

export default defineConfig({
  build: {
    sourcemap: false,
    rolldownOptions: {
      checks: {
        moduleLevelDirective: false,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    stripFirefoxCssWarnings(),
    tanstackStart({
      prerender: {
        enabled: false,
      },
    }),
    nitro(),
    tailwindcss(),
    react(),
  ],
});
