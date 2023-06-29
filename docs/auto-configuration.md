# Auto-configuration

🧪 **NOTE**: This feature is new and currently experimental. If you try this and it doesn't work for you, please provide your project details to [this issue](https://github.com/storybookjs/addon-styling/issues/49#issue-1746365130).

This feature currently works for the following tools in Storybook 7.0:

- Tailwind
- Material UI
- Styled-components
- Emotion
- ...more on the way

## How to use

1. Make sure you're using Storybook 7.0 and `@storybook/addon-styling` >=1.3.x
2. Run `yarn addon-styling-setup`
3. Confirm the results

## Known issues

- The codemods currently have issues configuring Storybook for monorepo setups
