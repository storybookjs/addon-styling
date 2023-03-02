# 🏁 Getting started with `bootstrap`

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

Now, **include the addon** in your `.storybook/main.js` file.

```diff
module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
+   "@storybook/addon-styling"
  ],
};
```

**NOTE:** If you want to use Bootstrap's `.scss` files, add the styling addon like so:

```js
module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-styling",
      options: {
        sass: {
          // Require your sass preprocessor here
          // I recommend dart sass (yarn add -D sass)
          implementation: require("sass"),
        },
      },
    },
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

If you're using `scss` import your `index.scss` file instead of Bootstrap's `bootstrap.min.css` file.

## 🎨 Provide your theme(s)

Bootstrap now supports light and dark color modes out of the box as well as the ability to make your own custom modes. These modes can be activated by setting a `data-bs-theme` attribute on a parent element.

To enable switching between these modes in a click for your stories, use our `withThemeByDataAttribute` decorator by adding the following code to your `.storybook/preview.js` file.

```diff
+import { withThemeByDataAttribute } from "@storybook/addon-styling";

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
