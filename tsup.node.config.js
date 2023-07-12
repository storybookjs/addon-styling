import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/postinstall.ts"],
  outDir: "./bin",
  splitting: false,
  minify: !options.watch,
  format: ["cjs"],
  treeshake: true,
  target: "node16",
  clean: true,
  platform: "node",
  esbuildOptions(options) {
    options.conditions = ["module"];
  },
}));
