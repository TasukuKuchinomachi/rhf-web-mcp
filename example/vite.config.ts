import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@rhf-webmcp/core": path.resolve(import.meta.dirname, "../packages/core/src"),
      "@rhf-webmcp/zod": path.resolve(import.meta.dirname, "../packages/zod/src"),
    },
  },
});
