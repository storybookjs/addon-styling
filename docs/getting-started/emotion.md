# 🏁 Getting started with `@emotion/styled`

## 📦 Install addon

To get started, **install the package** as a dev dependency

yarn:

```zsh
yarn add -D @storybook/addon-styling
```

npm:

```zsh
npm install -D @storybook/addon-styling
```

pnpm:

```zsh
pnpm add -D @storybook/addon-styling
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
+   "@storybook/addon-style-config"
  ],
};
```

## 🎨 Provide your theme(s)

Finally, provide your theme(s) and global styles component to your stories with our `withThemeFromJSXProvider` decorator.

Make the following changes to your `.storybook/preview.js`

```diff
+import { withThemeFromJSXProvider } from "@storybook/addon-styling";
+import { ThemeProvider } from '@emotion/react';
+import { GlobalStyles, lightTheme, darkTheme } from "../src/themes"; // import your custom theme configs


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
+    GlobalStyles: GlobalStyles,
+  }),
+];
```
