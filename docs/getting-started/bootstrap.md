# 🏁 Getting started with `bootstrap`

## 📦 Install addon

To get started, **install the package** as a dev dependency

yarn:

```zsh
yarn add -D storybook-addon-style-toolbox
```

npm:

```zsh
npm install -D storybook-addon-style-toolbox
```

pnpm:

```zsh
pnpm add -D storybook-addon-style-toolbox
```

## 🧩 Register Addon

Now, **include the addon** in your `.storybook/main.js` file.

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

## 🥾 Import Bootstrap

To give your stories access to Bootstrap's styles and JavaScript, import them into your `.storybook/preview.js` file.

```diff
+import "bootstrap/dist/css/bootstrap.min.css";
+import "bootstrap/dist/js/bootstrap.bundle";

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

Bootstrap now supports light and dark color modes out of the box as well as the ability to make your own custom modes. These modes can be activated by setting a `data-bs-theme` attribute on a parent element.

To enable switching between these modes in a click for your stories, use our `withThemeByDataAttribute` decorator by adding the following code to your `.storybook/preview.js` file.

```diff
+import { withThemeByDataAttribute } from "storybook-addon-style-toolbox";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

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
+  withThemeByDataAttribute({
+    themes: {
+      light: "light",
+      dark: "dark",
+    },
+    defaultTheme: "light",
+    attributeName: "data-bs-theme",
+  }),
+];
```
