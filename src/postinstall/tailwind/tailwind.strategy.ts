import { PackageJson } from "@storybook/types";
import { logger, colors } from "@storybook/node-logger";
import * as t from "@babel/types";

import { hasDependency, isAngular } from "../utils/dependencies.utils";
import {
  SUPPORTED_BUILDERS,
  SUPPORTED_STYLING_TOOLS,
  ToolConfigurationStrategy,
} from "../types";
import { addImports, stringToNode } from "../utils/babel.utils";

const projectHasTailwind = (packageJson: PackageJson) =>
  hasDependency(packageJson, "tailwindcss") &&
  hasDependency(packageJson, "postcss");

export const tailwindStrategy: ToolConfigurationStrategy = {
  name: SUPPORTED_STYLING_TOOLS.TAILWIND,
  predicate: projectHasTailwind,
  main: (mainConfig, packageJson, builder) => {
    logger.plain(`  • Registering ${colors.pink("@storybook/addon-styling")}.`);

    const usingAngular = isAngular(mainConfig);

    if (builder === SUPPORTED_BUILDERS.WEBPACK || usingAngular) {
      logger.plain(`    • Configuring ${colors.green("postcss")}.`);
    }

    const [addonConfigNode] =
      builder === SUPPORTED_BUILDERS.VITE || usingAngular
        ? stringToNode`({
      name: "@storybook/addon-styling",
      options: {}
    })`
        : stringToNode`({
      name: "@storybook/addon-styling",
      options: {
        postCss: {
          implementation: require.resolve("postcss")
        }
      }
    })`;

    const addonsNodePath = ["addons"];
    let addonsArrayNode = mainConfig.getFieldNode(addonsNodePath);

    if (!addonsArrayNode) {
      mainConfig.setFieldNode(addonsNodePath, t.arrayExpression());
      addonsArrayNode = mainConfig.getFieldNode(addonsNodePath);
    }

    // @ts-expect-error
    addonsArrayNode.elements.push(addonConfigNode);
  },
  preview: (previewConfig, packageJson, builder) => {
    logger.plain(
      `  • Adding import for ${colors.blue("withThemeByClassName")} decorator`
    );
    logger.plain(`  • Adding import for stylesheet`);

    const importsNode = stringToNode`import { withThemeByClassName } from '@storybook/addon-styling';

    /* TODO: update import to your tailwind styles file. If you're using Angular, inject this through your angular.json config instead */
    import '../src/index.css';`;

    addImports(previewConfig._ast, importsNode);

    logger.plain(
      `  • Adding ${colors.blue("withThemeByClassName")} decorator to config`
    );
    const [decoratorNode] = stringToNode`// Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    withThemeByClassName({
     themes: {
       light: 'light',
       dark: 'dark',
     },
     defaultTheme: 'light',
})`;

    const decoratorNodePath = ["decorators"];
    let decoratorArrayNode = previewConfig.getFieldNode(decoratorNodePath);

    if (!decoratorArrayNode) {
      previewConfig.setFieldNode(decoratorNodePath, t.arrayExpression());
      decoratorArrayNode = previewConfig.getFieldNode(decoratorNodePath);
    }

    // @ts-expect-error
    decoratorArrayNode.elements.push(decoratorNode);
  },
};
