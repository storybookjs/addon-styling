# 🏁 Getting started with `@mui/material`

## 📦 Install addon

To get started, **install the package** as a dev dependency

yarn:

```zsh
yarn add -D @storybook/addon-style-config
```

npm:

```zsh
npm install -D @storybook/addon-style-config
```

pnpm:

```zsh
pnpm add -D @storybook/addon-style-config
```

## 🧩 Register Addon

Now, **include the addon** in your `.storybook/main.js` file

```diff
module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
+   "@storybook/addon-style-config",
  ],
};
```

## 🔤 Import fonts

`@mui/material` requires Google's Roboto and Material Icon fonts to render everything as intended. I'd recommend getting them from [fontsource](https://github.com/fontsource/fontsource) so that they are version locked dependencies that doesn't require a CDN.

These can be imported into your `.storybook/preview.js` file.

```diff
+// Load Material UI fonts
+import "@fontsource/roboto/300.css";
+import "@fontsource/roboto/400.css";
+import "@fontsource/roboto/500.css";
+import "@fontsource/roboto/700.css";
+import "@fontsource/material-icons";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    expanded: true,
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

## 🎨 Provide your theme(s)

While Material UI comes with a default theme that works out of the box. You can create your own theme(s) and provide them to your stories with our `withThemeFromJSXProvider` decorator.

Make the following changes to your `.storybook/preview.js`

```diff
+import { withThemeFromJSXProvider } from "@storybook/addon-styling";
+import { CssBaseline, ThemeProvider } from "@mui/material";
+import { lightTheme, darkTheme } from "../src/themes"; // import your custom theme configs

// Load Roboto fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/material-icons";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    expanded: true,
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

+export const decorators = [
+  withThemeFromJSXProvider({
+    themes: {
+      light: lightTheme,
+      dark: darkTheme,
+    },
+    defaultTheme: "light",
+    Provider: ThemeProvider,
+    GlobalStyles: CssBaseline,
+  }),
+];
```
