import { PackageJson } from "@storybook/types";
import { babelParse } from "@storybook/csf-tools";

import { hasDependency } from "../utils/dependencies.utils";
import {
  SUPPORTED_BUILDERS,
  SUPPORTED_STYLING_TOOLS,
  ToolConfigurationStrategy,
} from "../types";

const projectHasTailwind = (packageJson: PackageJson) =>
  hasDependency(packageJson, "tailwindcss") &&
  hasDependency(packageJson, "postcss");

export const tailwindStrategy: ToolConfigurationStrategy = {
  name: SUPPORTED_STYLING_TOOLS.TAILWIND,
  predicate: projectHasTailwind,
  main: (builder, mainConfig, { logger, colors }) => {
    if (builder === SUPPORTED_BUILDERS.VITE) {
      // Vite does not require extra configuration
      logger.plain(`  • No changes required.`);
      return;
    }

    logger.plain(`  • Configuring ${colors.green("postcss")}.`);
    const addonConfigString = `({
      "name": "@storybook/addon-styling",
      "options": {
        "postcss": { implementation: require.resolve('postcss'), },
      },
    })`;

    mainConfig.appendNodeToArray(
      ["addons"],
      babelParse(addonConfigString).program.body[0].expression
    );
  },
  preview: (builder, previewConfig) => {},
};
