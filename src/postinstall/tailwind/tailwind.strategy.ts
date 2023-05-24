import { PackageJson } from "@storybook/types";

import { hasDependency } from "../utils/dependencies.utils";
import {
  SUPPORTED_BUILDERS,
  SUPPORTED_STYLING_TOOLS,
  ToolConfigurationStrategy,
} from "../types";
import {
  AddCommentBeforeBabelNode,
  addImports,
  parseStringToBabelNode,
} from "../utils/babel.utils";

const projectHasTailwind = (packageJson: PackageJson) =>
  hasDependency(packageJson, "tailwindcss") &&
  hasDependency(packageJson, "postcss");

export const tailwindStrategy: ToolConfigurationStrategy = {
  name: SUPPORTED_STYLING_TOOLS.TAILWIND,
  predicate: projectHasTailwind,
  main: (mainConfig, packageJson, builder, { logger, colors }) => {
    if (builder === SUPPORTED_BUILDERS.VITE) {
      // Vite does not require extra configuration
      logger.plain(`  • No changes required.`);
      return;
    }

    logger.plain(`  • Configuring ${colors.green("postcss")}.`);

    mainConfig.appendNodeToArray(
      ["addons"],
      parseStringToBabelNode(`({
        "name": "@storybook/addon-styling",
        "options": {
          "postcss": { implementation: require.resolve('postcss'), },
        },
      })`)
    );
  },
  preview: (previewConfig, packageJson, builder, { logger, colors }) => {
    logger.plain(
      `  • Adding import for ${colors.blue("withThemeByClassName")} decorator`
    );
    const decoratorImportNode = parseStringToBabelNode(
      `import { withThemeByClassName } from '@storybook/addon-styling';`
    );

    logger.plain(`  • Adding import for stylesheet`);
    const styleImportNode = parseStringToBabelNode(`import '../src/app.css';`);
    AddCommentBeforeBabelNode(
      `TODO: update import to your tailwind styles file`,
      styleImportNode,
      true
    );

    addImports(previewConfig._ast, [decoratorImportNode, styleImportNode]);

    logger.plain(
      `  • Adding ${colors.blue("withThemeByClassName")} decorator to config`
    );
    const decoratorNode = parseStringToBabelNode(`
withThemeByClassName({
     themes: {
       light: 'light',
       dark: 'dark',
     },
     defaultTheme: 'light',
})`).expression;

    AddCommentBeforeBabelNode(
      `
  Uncomment to add theme switching support
  NOTE: requires setting "darkMode" to "class" in your tailwind config
`,
      decoratorNode
    );

    previewConfig.appendNodeToArray(["decorators"], decoratorNode);
  },
};
