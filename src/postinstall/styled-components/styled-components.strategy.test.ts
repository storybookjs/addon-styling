import { describe, it, expect, vi } from "vitest";
import { PackageJson } from "@storybook/types";
import { readConfig } from "@storybook/csf-tools";
import { resolve } from "node:path";

import { styledComponentsStrategy } from "./styled-components.strategy";
import { SUPPORTED_BUILDERS } from "../types";
import { formatFileContents } from "../utils/configs.utils";

describe("CODEMOD: Styled Components configuration", () => {
  describe("PREDICATE: should project be configured for Styled Components?", () => {
    it("TRUE: it should return true when Styled Components is found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: {
          "styled-components": "latest",
        },
        devDependencies: {},
      };

      const result = styledComponentsStrategy.predicate(packageJson);

      expect(result).toBeTruthy();
    });
    it("FALSE: it should return false when Styled Components is not found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: { bootstrap: "latest" },
        devDependencies: {},
      };

      const result = styledComponentsStrategy.predicate(packageJson);

      expect(result).toBeFalsy();
    });
  });

  describe("MAIN: how should storybook be configured for Styled Components", () => {
    it("REGISTER: addon-styling should be registered in the addons array without options", async () => {
      const mainConfig = await readConfig(
        resolve(__dirname, "../fixtures/main.fixture.ts")
      );
      const packageJson: PackageJson = {
        dependencies: {
          "styled-components": "latest",
        },
        devDependencies: { postcss: " latest" },
      };

      styledComponentsStrategy.main(
        mainConfig,
        packageJson,
        SUPPORTED_BUILDERS.VITE
      );

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
  });

  describe("PREVIEW: how should storybook preview be configured for Styled Components", () => {
    it("CONFIGURE: Preview.ts should be updated with the imports and theme decorator", async () => {
      const previewConfig = await readConfig(
        resolve(__dirname, "../fixtures/preview.fixture.ts")
      );
      const packageJson: PackageJson = {
        dependencies: {
          "styled-components": "latest",
        },
        devDependencies: { postcss: " latest" },
      };

      styledComponentsStrategy.preview(
        previewConfig,
        packageJson,
        SUPPORTED_BUILDERS.WEBPACK
      );

      const result = formatFileContents(previewConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { Preview } from \\"@storybook/react\\";

        import { createGlobalStyle, ThemeProvider } from \\"styled-components\\";
        import { withThemeFromJSXProvider } from \\"@storybook/addon-styling\\";

        /* TODO: update import for your custom theme configurations */
        // import { lightTheme, darkTheme } from '../path/to/themes';

        /* TODO: replace with your own global styles, or remove */
        const GlobalStyles = createGlobalStyle\`
            body {
              font-family: \\"Helvetica Neue\\", Helvetica, Arial, sans-serif;
            }
          \`;

        const preview: Preview = {
          parameters: {
            theming: {},
          },

          decorators: [
            // Adds global styles and theme switching support.
            withThemeFromJSXProvider({
              /* Uncomment for theme switching support */
              // themes: {
              //   light: lightTheme,
              //   dark: darkTheme,
              // }
              // defaultTheme: 'light',
              // Provider: ThemeProvider,
              GlobalStyles,
            }),
          ],
        };

        export default preview;
        "
      `);
    });
  });
});
