// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("framer-motion")) return "vendor-framer-motion";
            if (id.includes("recharts") || id.includes("d3-")) return "vendor-recharts";
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("@tanstack/react-query")) return "vendor-react-query";
            if (id.includes("@tanstack/react-router") || id.includes("@tanstack/start")) return "vendor-router";
            if (id.includes("node_modules")) return "vendor-misc";
          }
        }
      }
    }
  }
});
