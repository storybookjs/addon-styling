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
    it("VITE: addon-styling should be registered without options", async () => {
      const mainConfig = await readConfig(
        resolve(__dirname, "../fixtures/main.react-vite.fixture.ts")
      );

      const meta: StorybookProjectMeta = {
        dependencies: { tailwindcss: "latest" },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-vite",
        builder: SUPPORTED_BUILDERS.VITE,
      };

      tailwindStrategy.main(mainConfig, meta);

      const result = formatFileContents(mainConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { StorybookConfig } from \\"@storybook/react-vite\\";
        const config: StorybookConfig = {
          stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
          addons: [
            \\"@storybook/addon-essentials\\",
            {
              name: \\"@storybook/addon-styling\\",
              options: {},
            },
          ],
          framework: {
            name: \\"@storybook/react-vite\\",
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
                postCss: {
                  implementation: require.resolve(\\"postcss\\"),
                },
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

    it("Angular: addon-styling should be registered without options", async () => {
      const mainConfig = await readConfig(
        resolve(__dirname, "../fixtures/main.angular.fixture.ts")
      );
      const meta: StorybookProjectMeta = {
        dependencies: { tailwindcss: "latest" },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/angular",
        builder: SUPPORTED_BUILDERS.WEBPACK,
      };

      tailwindStrategy.main(mainConfig, meta);

      const result = formatFileContents(mainConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { StorybookConfig } from \\"@storybook/angular\\";
        const config: StorybookConfig = {
          stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
          addons: [
            \\"@storybook/addon-essentials\\",
            {
              name: \\"@storybook/addon-styling\\",
              options: {},
            },
          ],
          framework: {
            name: \\"@storybook/angular\\",
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

    it("NextJS: addon-styling should be registered without options", async () => {
      const mainConfig = await readConfig(
        resolve(__dirname, "../fixtures/main.nextjs.fixture.ts")
      );
      const meta: StorybookProjectMeta = {
        dependencies: { tailwindcss: "latest" },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/nextjs",
        builder: SUPPORTED_BUILDERS.WEBPACK,
      };

      tailwindStrategy.main(mainConfig, meta);

      const result = formatFileContents(mainConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { StorybookConfig } from \\"@storybook/nextjs\\";
        const config: StorybookConfig = {
          stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
          addons: [
            \\"@storybook/addon-essentials\\",
            {
              name: \\"@storybook/addon-styling\\",
              options: {},
            },
          ],
          framework: {
            name: \\"@storybook/nextjs\\",
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

  describe("PREVIEW: how should storybook preview be configured for tailwind", () => {
    it("CONFIGURATION: Preview.ts should be updated with the style import todo, as well as the theme decorator", async () => {
      const previewConfig = await readConfig(
        resolve(__dirname, "../fixtures/preview.fixture.ts")
      );
      const meta: StorybookProjectMeta = {
        dependencies: { tailwindcss: "latest" },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-vite",
        builder: SUPPORTED_BUILDERS.VITE,
      };

      tailwindStrategy.preview(previewConfig, meta);

      const result = formatFileContents(previewConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { Preview } from \\"@storybook/react\\";

        import { withThemeByClassName } from \\"@storybook/addon-styling\\";

        /* TODO: update import to your tailwind styles file. If you're using Angular, inject this through your angular.json config instead */
        import \\"../src/index.css\\";

        const preview: Preview = {
          parameters: {
            theming: {},
          },

          decorators: [
            // Adds theme switching support.
            // NOTE: requires setting \\"darkMode\\" to \\"class\\" in your tailwind config
            withThemeByClassName({
              themes: {
                light: \\"light\\",
                dark: \\"dark\\",
              },
              defaultTheme: \\"light\\",
            }),
          ],
        };

        export default preview;
        "
      `);
    });
  });
});
