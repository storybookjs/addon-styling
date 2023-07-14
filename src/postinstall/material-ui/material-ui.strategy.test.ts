import { describe, it, expect, vi } from "vitest";
import { PackageJson } from "@storybook/types";
import { readConfig } from "@storybook/csf-tools";
import { resolve } from "node:path";

import { materialUIStrategy } from "./material-ui.strategy";
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from "../types";
import { formatFileContents } from "../utils/configs.utils";

describe("CODEMOD: Material UI configuration", () => {
  describe("PREDICATE: should project be configured for Material UI?", () => {
    it("TRUE: it should return true when Material UI is found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: {
          "@mui/material": "latest",
          "@emotion/react": "latest",
          "@emotion/styled": "latest",
        },
        devDependencies: {},
      };

      const result = materialUIStrategy.predicate(packageJson);

      expect(result).toBeTruthy();
    });
    it("FALSE: it should return false when Material UI is not found in package.json", () => {
      const packageJson: PackageJson = {
        dependencies: { bootstrap: "latest" },
        devDependencies: {},
      };

      const result = materialUIStrategy.predicate(packageJson);

      expect(result).toBeFalsy();
    });
  });

  describe("MAIN: how should storybook be configured for Material UI", () => {
    it("REGISTER: addon-styling should be registered in the addons array without options", async () => {
      const mainConfig = await readConfig(
        resolve(__dirname, "../fixtures/main.react-vite.fixture.ts")
      );

      const meta: StorybookProjectMeta = {
        dependencies: {
          "@mui/material": "latest",
          "@emotion/react": "latest",
          "@emotion/styled": "latest",
        },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-vite",
        builder: SUPPORTED_BUILDERS.VITE,
      };

      materialUIStrategy.main(mainConfig, meta);

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

  describe("PREVIEW: how should storybook preview be configured for Material UI", () => {
    it("NO FONT: Preview.ts should be updated with the imports, theme decorator, and a todo for importing fonts", async () => {
      const previewConfig = await readConfig(
        resolve(__dirname, "../fixtures/preview.fixture.ts")
      );
      const meta: StorybookProjectMeta = {
        dependencies: {
          "@mui/material": "latest",
          "@emotion/react": "latest",
          "@emotion/styled": "latest",
        },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-vite",
        builder: SUPPORTED_BUILDERS.VITE,
      };

      materialUIStrategy.preview(previewConfig, meta);

      const result = formatFileContents(previewConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { Preview } from \\"@storybook/react\\";

        import { ThemeProvider, CssBaseline } from \\"@mui/material\\";
        import { withThemeFromJSXProvider } from \\"@storybook/addon-styling\\";

        /* TODO: update import for your custom Material UI themes */
        // import { lightTheme, darkTheme } from '../path/to/themes';

        // Import your fontface CSS files here
        // Don't have any? We recommend installing and using @fontsource/roboto

        const preview: Preview = {
          parameters: {
            theming: {},
          },

          decorators: [
            // Adds global styles and theme switching support.
            withThemeFromJSXProvider({
              GlobalStyles: CssBaseline,
              // Uncomment for theme switching
              // Provider: ThemeProvider,
              // themes: {
              // Provide your custom themes here
              //   light: lightTheme,
              //   dark: darkTheme,
              // },
              // defaultTheme: 'light',
            }),
          ],
        };

        export default preview;
        "
      `);
    });

    it("FONT: Preview.ts should be updated with the imports, theme decorator, and roboto fonts", async () => {
      const previewConfig = await readConfig(
        resolve(__dirname, "../fixtures/preview.fixture.ts")
      );

      const meta: StorybookProjectMeta = {
        dependencies: {
          "@mui/material": "latest",
          "@emotion/react": "latest",
          "@emotion/styled": "latest",
          "@fontsource/roboto": "latest",
        },
        devDependencies: { postcss: " latest" },
        peerDependencies: {},
        framework: "@storybook/react-vite",
        builder: SUPPORTED_BUILDERS.VITE,
      };

      materialUIStrategy.preview(previewConfig, meta);

      const result = formatFileContents(previewConfig);

      expect(result).toMatchInlineSnapshot(`
        "import type { Preview } from \\"@storybook/react\\";

        import { ThemeProvider, CssBaseline } from \\"@mui/material\\";
        import { withThemeFromJSXProvider } from \\"@storybook/addon-styling\\";

        /* TODO: update import for your custom Material UI themes */
        // import { lightTheme, darkTheme } from '../path/to/themes';

        import \\"@fontsource/roboto/300.css\\";
        import \\"@fontsource/roboto/400.css\\";
        import \\"@fontsource/roboto/500.css\\";
        import \\"@fontsource/roboto/700.css\\";

        const preview: Preview = {
          parameters: {
            theming: {},
          },

          decorators: [
            // Adds global styles and theme switching support.
            withThemeFromJSXProvider({
              GlobalStyles: CssBaseline,
              // Uncomment for theme switching
              // Provider: ThemeProvider,
              // themes: {
              // Provide your custom themes here
              //   light: lightTheme,
              //   dark: darkTheme,
              // },
              // defaultTheme: 'light',
            }),
          ],
        };

        export default preview;
        "
      `);
    });
  });
});
