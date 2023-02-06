# storybook-addon-style-toolbox

Configurations for popular styling tools as well as theme toggling.

![Toggling between themes](./.github/media/styles-addon.gif)

## 🏁 Getting Started

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

Then, **include the addon** in your `.storybook/main.js` file

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

## 👇 Tool specific configuration

For tool-specific setup, check out the recipes below

- [`@emotion/styled`](./docs/getting-started/emotion.md)
- [`@mui/material`](./docs/getting-started/material-ui.md)
- [`bootstrap`](./docs/getting-started/bootstrap.md)
- [`styled-components`](./docs/getting-started/styled-components.md)
- [`tailwind`](./docs/getting-started/tailwind.md)
- [Vuetify 3](./docs/api.md#writing-a-custom-decorator)

Don't see your favorite tool listed? Don't worry! That doesn't mean this addon isn't for you. Check out the ["Writing a custom decorator"](./docs/api.md#writing-a-custom-decorator) section of the [api reference](./docs/api.md).

## 🤝 Contributing

If you'd like to contribute to this addon, **THANK YOU**, I'd love your help 🙏

### 📝 Development scripts

- `yarn start` runs babel in watch mode and starts Storybook
- `yarn build` build and package your addon code
