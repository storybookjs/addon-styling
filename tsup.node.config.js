import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  clean: true,
  entry: ["src/postinstall.ts"],
  format: ["cjs"],
  minify: !options.watch,
  outDir: "./bin",
  platform: "node",
  splitting: false,
  target: "node16",
  treeshake: true,
  esbuildOptions(options) {
    options.conditions = ["module"];
  },
}));
