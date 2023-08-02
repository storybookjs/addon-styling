import { logger, colors } from "@storybook/node-logger";
import * as t from "@babel/types";
import {
  CONFIGURATION_KEY_TO_NAME,
  ConfigurationKey,
  SUPPORTED_STYLING_TOOLS,
  ToolConfigurationStrategy,
} from "../types";
import { askUser } from "../utils/outputs";
import { addImports, createNode } from "../utils/babel.utils";
import { buildAddonConfig, buildImports } from "../utils/configure";

export const fallbackStrategy: ToolConfigurationStrategy = {
  name: SUPPORTED_STYLING_TOOLS.FALLBACK,
  predicate: (_) => true,
  main: async (mainConfig, meta) => {
    const configMap = await askUser.whatToConfigure();

    if (Object.keys(configMap).length === 0) {
      //TODO handle no-op case
    }

    if (configMap.vanillaExtract) {
      // Add imports for webpack plugins
      const importsNode = createNode(buildImports(configMap));
      addImports(mainConfig._ast, importsNode);
    }

    const [addonConfigNode] = createNode(buildAddonConfig(configMap));

    const addonsNodePath = ["addons"];
    let addonsArrayNode = mainConfig.getFieldNode(addonsNodePath);

    if (!addonsArrayNode) {
      mainConfig.setFieldNode(addonsNodePath, t.arrayExpression());
      addonsArrayNode = mainConfig.getFieldNode(addonsNodePath);
    }

    // @ts-expect-error
    addonsArrayNode.elements.push(addonConfigNode);

    const configuredTools = Object.keys(configMap)
      .filter((tool: ConfigurationKey) => configMap[tool])
      .map(
        (tool: ConfigurationKey) =>
          `Configured ${colors.blue.bold(
            CONFIGURATION_KEY_TO_NAME[tool]
          )} for ${colors.blue.bold("webpack")}`
      );

    return {
      changed: [...configuredTools],
      nextSteps: [`🚀 Launch ${colors.pink.bold("storybook")}`],
    };
  },
};
