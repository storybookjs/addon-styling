import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      passWithNoTests: true,
      reporters: "verbose",
      setupFiles: ["./vitest/setup.ts"],
    },
  })
);
