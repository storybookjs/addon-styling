import type { StorybookConfig } from "@storybook/angular";
const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
export default config;
