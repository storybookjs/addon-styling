import { PackageJson } from "@storybook/types";
import * as t from "@babel/types";

import { hasDependency } from "../utils/dependencies.utils";
import { SUPPORTED_STYLING_TOOLS, ToolConfigurationStrategy } from "../types";
import { addImports, stringToNode } from "../utils/babel.utils";

const projectHasMaterialUI = (packageJson: PackageJson) =>
  hasDependency(packageJson, "@mui/material") &&
  hasDependency(packageJson, "@emotion/react") &&
  hasDependency(packageJson, "@emotion/styled");

export const materialUIStrategy: ToolConfigurationStrategy = {
  name: SUPPORTED_STYLING_TOOLS.MATERIAL_UI,
  predicate: projectHasMaterialUI,
  main: (mainConfig, packageJson, builder, { logger, colors }) => {
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
  preview: (previewConfig, packageJson, builder, { logger, colors }) => {
    logger.plain(
      `  • Adding imports for ${colors.green(
        SUPPORTED_STYLING_TOOLS.MATERIAL_UI
      )}, ${colors.blue("ThemeProvider")}, and ${colors.blue(
        "CssBaseline"
      )} components`
    );
    logger.plain(
      `  • Adding import for ${colors.blue(
        "withThemeFromJSXProvider"
      )} decorator`
    );
    hasDependency(packageJson, "@fontsource/roboto")
      ? logger.plain(`  • importing ${colors.blue("roboto")} font files.`)
      : logger.plain(
          `  • Could not detect ${colors.blue(
            "roboto"
          )} font. Skipping font import`
        );

    const importsNode = hasDependency(packageJson, "@fontsource/roboto")
      ? stringToNode`
    import { ThemeProvider, CssBaseline } from '@mui/material';
    import { withThemeFromJSXProvider } from '@storybook/addon-styling';

    /* TODO: update import for your custom Material UI themes */
    // import { lightTheme, darkTheme } from '../path/to/themes';
    
    import '@fontsource/roboto/300.css';
    import '@fontsource/roboto/400.css';
    import '@fontsource/roboto/500.css';
    import '@fontsource/roboto/700.css';
    `
      : stringToNode`
    import { ThemeProvider, CssBaseline } from '@mui/material';
    import { withThemeFromJSXProvider } from '@storybook/addon-styling';

    // TODO: update import for your custom Material UI themes
    // import { lightTheme, darkTheme } from '../path/to/themes';
    
    // Import your fontface CSS files here
    // Don't have any? We recommend installing and using @fontsource/roboto`;

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
        GlobalStyles: CssBaseline,
      // Uncomment for theme switching
     // Provider: ThemeProvider,
     // themes: {
     // Provide your custom themes here
     //   light: lightTheme,
     //   dark: darkTheme,
     // },
     // defaultTheme: 'light',
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
