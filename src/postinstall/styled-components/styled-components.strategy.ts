import { PackageJson } from "@storybook/types";
import { logger, colors } from "@storybook/node-logger";
import * as t from "@babel/types";

import { hasDependency } from "../utils/dependencies.utils";
import { SUPPORTED_STYLING_TOOLS, ToolConfigurationStrategy } from "../types";
import { addImports, stringToNode } from "../utils/babel.utils";

const projectHasStyledComponents = (packageJson: PackageJson) =>
  hasDependency(packageJson, "styled-components");

export const styledComponentsStrategy: ToolConfigurationStrategy = {
  name: SUPPORTED_STYLING_TOOLS.STYLED_COMPONENTS,
  predicate: projectHasStyledComponents,
  main: (mainConfig, meta) => {
    logger.plain(`  • Registering ${colors.pink("@storybook/addon-styling")}.`);

    const [addonConfigNode] = stringToNode`({
      name: "@storybook/addon-styling",
      options: {}
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
  preview: (previewConfig, meta) => {
    logger.plain(
      `  • Adding imports for ${colors.green(
        SUPPORTED_STYLING_TOOLS.EMOTION
      )}, ${colors.blue("ThemeProvider")}, ${colors.blue(
        "Global"
      )}, and ${colors.blue("css")}`
    );
    logger.plain(
      `  • Adding import for ${colors.blue(
        "withThemeFromJSXProvider"
      )} decorator`
    );

    const importsNode = stringToNode`
    import { createGlobalStyle, ThemeProvider } from 'styled-components';
    import { withThemeFromJSXProvider } from '@storybook/addon-styling';

    /* TODO: update import for your custom theme configurations */
    // import { lightTheme, darkTheme } from '../path/to/themes';
    
    /* TODO: replace with your own global styles, or remove */
    const GlobalStyles = createGlobalStyle\`
        body {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
      \`;
    `;

    addImports(previewConfig._ast, importsNode);

    logger.plain(
      `  • Adding ${colors.blue(
        "withThemeFromJSXProvider"
      )} decorator to config`
    );
    const [
      decoratorNode,
    ] = stringToNode`// Adds global styles and theme switching support.
    withThemeFromJSXProvider({
        /* Uncomment for theme switching support */
        // themes: {
        //   light: lightTheme,
        //   dark: darkTheme,
        // }
        // defaultTheme: 'light',
        // Provider: ThemeProvider,
        GlobalStyles,
      })`;

    const decoratorNodePath = ["decorators"];
    let decoratorArrayNode = previewConfig.getFieldNode(decoratorNodePath);

    if (!decoratorArrayNode) {
      previewConfig.setFieldNode(decoratorNodePath, t.arrayExpression());
      decoratorArrayNode = previewConfig.getFieldNode(decoratorNodePath);
    }

    // @ts-expect-error
    // There are specific types for each kind of node and only array nodes have the elements property
    decoratorArrayNode.elements.push(decoratorNode);
  },
};
