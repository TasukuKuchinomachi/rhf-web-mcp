import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@rhf-webmcp/core": path.resolve(__dirname, "packages/core/src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
