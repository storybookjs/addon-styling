import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/postinstall.ts"],
  outDir: "./bin",
  splitting: false,
  minify: !options.watch,
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  treeshake: true,
  sourcemap: true,
  clean: true,
  platform: "node",
  esbuildOptions(options) {
    options.conditions = ["module"];
  },
}));
