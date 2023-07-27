import { PackageJson } from "@storybook/types";
import { logger, colors } from "@storybook/node-logger";
import * as t from "@babel/types";

import { hasDependency } from "../utils/dependencies.utils";
import { SUPPORTED_STYLING_TOOLS, ToolConfigurationStrategy } from "../types";
import { addImports, createNode } from "../utils/babel.utils";
import { buildAddonConfig, buildImports } from "../utils/configure";

const projectHasVanillaExtract = (packageJson: PackageJson) =>
  hasDependency(packageJson, "@vanilla-extract/webpack-plugin");

export const vanillaExtractStrategy: ToolConfigurationStrategy = {
  name: SUPPORTED_STYLING_TOOLS.VANILLA_EXTRACT,
  predicate: projectHasVanillaExtract,
  main: async (mainConfig, meta) => {
    // Add imports for required plugins
    const importsNode = createNode(
      buildImports({
        vanillaExtract: true,
      })
    );
    addImports(mainConfig._ast, importsNode);

    const [addonConfigNode] = createNode(
      buildAddonConfig({
        vanillaExtract: true,
      })
    );

    const addonsNodePath = ["addons"];
    let addonsArrayNode = mainConfig.getFieldNode(addonsNodePath);

    if (!addonsArrayNode) {
      mainConfig.setFieldNode(addonsNodePath, t.arrayExpression([]));
      addonsArrayNode = mainConfig.getFieldNode(addonsNodePath);
    }

    // @ts-expect-error
    addonsArrayNode.elements.push(addonConfigNode);

    return {
      changed: [
        `Configured ${colors.blue.bold("postcss")} for ${colors.blue.bold(
          "webpack"
        )}`,
      ],
      nextSteps: [`🚀 Launch ${colors.pink.bold("storybook")}`],
    };
  },
};
