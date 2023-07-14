import { describe, it, expect, vi } from "vitest";
import { PackageJson } from "@storybook/types";
import { readConfig } from "@storybook/csf-tools";
import { resolve } from "node:path";

import { emotionStrategy } from "./emotion.strategy";
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from "../types";
import { formatFileContents } from "../utils/configs.utils";

describe("CODEMOD: Emotion configuration", () => {
  describe("PREDICATE: should project be configured for Emotion?", () => {
    it("TRUE: it should return true when Emotion is found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: {
          "@emotion/react": "latest",
          "@emotion/styled": "latest",
        },
        devDependencies: {},
      };

      const result = emotionStrategy.predicate(packageJson);

      expect(result).toBeTruthy();
    });
    it("FALSE: it should return false when Emotion is not found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: { bootstrap: "latest" },
        devDependencies: {},
      };

      const result = emotionStrategy.predicate(packageJson);

      expect(result).toBeFalsy();
    });
  });

  describe("MAIN: how should storybook be configured for Emotion", () => {
    it("REGISTER: addon-styling should be registered in the addons array without options", async () => {
      const mainConfig = await readConfig(
        resolve(__dirname, "../fixtures/main.react-vite.fixture.ts")
      );
      const meta: StorybookProjectMeta = {
        dependencies: {
          "@emotion/react": "latest",
          "@emotion/styled": "latest",
        },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-vite",
        builder: SUPPORTED_BUILDERS.VITE,
      };

      emotionStrategy.main(mainConfig, meta);

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

  describe("PREVIEW: how should storybook preview be configured for Emotion", () => {
    it("CONFIGURE: Preview.ts should be updated with the imports and theme decorator", async () => {
      const previewConfig = await readConfig(
        resolve(__dirname, "../fixtures/preview.fixture.ts")
      );

      const meta: StorybookProjectMeta = {
        dependencies: {
          "@emotion/react": "latest",
          "@emotion/styled": "latest",
        },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-vite",
        builder: SUPPORTED_BUILDERS.VITE,
      };

      emotionStrategy.preview(previewConfig, meta);

      const result = formatFileContents(previewConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { Preview } from \\"@storybook/react\\";

        import { Global, css, ThemeProvider } from \\"@emotion/react\\";
        import { withThemeFromJSXProvider } from \\"@storybook/addon-styling\\";

        /* TODO: update import for your custom theme configurations */
        // import { lightTheme, darkTheme } from '../path/to/themes';

        /* TODO: replace with your own global styles, or remove */
        const GlobalStyles = () => (
          <Global
            styles={css\`
              body {
                font-family: \\"Helvetica Neue\\", Helvetica, Arial, sans-serif;
              }
            \`}
          />
        );

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
