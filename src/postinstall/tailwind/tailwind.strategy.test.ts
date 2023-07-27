import { describe, it, expect, vi } from "vitest";
import { PackageJson } from "@storybook/types";
import { readConfig } from "@storybook/csf-tools";
import { resolve } from "node:path";

import { tailwindStrategy } from "./tailwind.strategy";
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from "../types";
import { formatFileContents } from "../utils/configs.utils";

describe("CODEMOD: tailwind configuration", () => {
  describe("PREDICATE: should project be configured for tailwind?", () => {
    it("TRUE: it should return true when tailwind is found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: { tailwindcss: "latest" },
        devDependencies: { postcss: " latest" },
      };

      const result = tailwindStrategy.predicate(packageJson);

      expect(result).toBeTruthy();
    });
    it("FALSE: it should return false when tailwind is not found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: { bootstrap: "latest" },
        devDependencies: {},
      };

      const result = tailwindStrategy.predicate(packageJson);

      expect(result).toBeFalsy();
    });
  });

  describe("MAIN: how should storybook be configured for tailwind", () => {
    it("WEBPACK: addon-styling should be configured with postcss support", async () => {
      const mainConfig = await readConfig(
        resolve(__dirname, "../fixtures/main.react-webpack5.fixture.ts")
      );
      const meta: StorybookProjectMeta = {
        dependencies: { tailwindcss: "latest" },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-webpack5",
        builder: SUPPORTED_BUILDERS.WEBPACK,
      };

      tailwindStrategy.main(mainConfig, meta);

      const result = formatFileContents(mainConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { StorybookConfig } from \\"@storybook/react-webpack5\\";
        const config: StorybookConfig = {
          stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
          addons: [
            \\"@storybook/addon-essentials\\",
            {
              name: \\"@storybook/addon-styling\\",
              options: {
                rules: [
                  {
                    test: /\\\\.css$/,
                    sideEffects: true,
                    use: [
                      require.resolve(\\"style-loader\\"),
                      {
                        loader: require.resolve(\\"css-loader\\"),
                        options: {
                          importLoaders: 1,
                        },
                      },
                      {
                        loader: require.resolve(\\"postcss-loader\\"),
                        options: {
                          implementation: require.resolve(\\"postcss\\"),
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
          framework: {
            name: \\"@storybook/react-webpack5\\",
            options: {},
          },
          docs: {
            autodocs: true,
          },
        };
        export default config;
        "
      `);
    });
  });
});
