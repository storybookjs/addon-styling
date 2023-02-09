# 🏁 Getting started with `tailwind.css`

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

### 📝 Using PostCSS?

If your project uses webpack and postCSS you will need to add the `@storybook/addon-postcss` addon as well. To do this, install it as a dependency and add it to your `.storybook/main.js` file.

```diff
module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
+   "@storybook/addon-postcss"
    "@storybook/addon-styling"
  ],
};
```

## 🥾 Import your CSS

To give your stories access to Tailwind styles, import them into your `.storybook/preview.js` file.

```diff
+import "../src/index.css";

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

Tailwind supports light and dark color modes out of the box. These modes can be activated by setting a `.dark` class on a parent element.

To enable switching between these modes in a click for your stories, use our `withThemeByClassName` decorator by adding the following code to your `.storybook/preview.js` file.

```diff
+import { withThemeByClassName } from "@storybook/addon-styling";
import "../src/index.css";


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
+  withThemeByClassName({
+    themes: {
+      light: "",
+      dark: "dark",
+    },
+    defaultTheme: "light",
+  }),
+];
```

## 🏷️ Using a data-attribute for theme?

If you've configured Tailwind to toggle themes with a data attribute, use our `withThemeByDataAttribute` decorator by adding the following code to your `.storybook/preview.js` file.

```diff
+import { withThemeByDataAttribute } from "@storybook/addon-styling";
import "../src/index.css";


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
