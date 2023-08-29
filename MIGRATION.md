# Migration guide

## `@storybook/addon-styling` to `@storybook/addon-styling-webpack`

This guide will walk you through the steps to migrate from `@storybook/addon-styling` to `@storybook/addon-styling-webpack` for configuring your Webpack-based Storybook to use CSS Modules, PostCSS, Sass, and/or Less.

If you are using `@storybook/addon-styling` with a non-Webpack-based Storybook or just want theme switching capabilities, you can skip to [`@storybook/addon-themes`](#storybookaddon-styling-to-storybookaddon-themes) section.

### 📦 Add `@storybook/addon-styling-webpack`

Run the following command to add `@storybook/addon-styling-webpack` to your project and have the CLI automatically update your Storybook configuration for your desired styling tool.

If it does not recognize your project's styling tool, it will prompt you to select the tools that you'd like to configure.

```sh
# For pnpm users
pnpm dlx storybook@latest add @storybook/addon-styling-webpack

# For yarn users
yarn dlx storybook@latest add @storybook/addon-styling-webpack

# For npm users
npx @storybook/cli@latest add @storybook/addon-styling-webpack

```

### ⚙️ Port any extra options

If you were using any extra options in `options.postCss`, `options.sass`, or `options.less`, other than `implementation`, you'll need to port those over to their respective loaders in `@storybook/addon-styling-webpack`.

For example, if you were using `options.sass.sassOptions` to configure your Sass loader, you'll need to port those options over to the `sass-loader` in `@storybook/addon-styling-webpack`.

Before:

```js
  {
    name: '@storybook/addon-styling',
    options: {
      sass: {
        implementation: require.resolve('sass'),
        sassOptions: {
          includePaths: ['node_modules'],
        },
      },
    },
  }
```

After:

```js
    {
        name: '@storybook/addon-styling-webpack',
        options: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require.resolve('sass'),
                                sassOptions: {
                                    includePaths: ['node_modules'],
                                },
                            },
                        },
                    ],
                },
            ],
        },
    }
```

### 📦 Remove `@storybook/addon-styling`

You can now remove `@storybook/addon-styling` from your project dependencies and addons array in your `.storybook/main.ts` file.

If you were also using `@storybook/addon-styling` for theme switching capabilities, read the section below on how to migrate to `@storybook/addon-themes`.

## `@storybook/addon-styling` to `@storybook/addon-themes`

This guide will walk you through the steps to migrate from `@storybook/addon-styling` to `@storybook/addon-themes` for configuring your Storybook to use theme switching capabilities.

1. Add `@storybook/addon-themes` to your project as a `DevDependency`.
2. Remove `@storybook/addon-styling` from your project.
3. Remove `@storybook/addon-styling` from the addons array in your `.storybook/main.ts` file.
4. Add `@storybook/addon-themes` to the addons array in your `.storybook/main.ts` file.
5. Replace the import for your themes decorator from `@storybook/addon-styling` to `@storybook/addon-themes` in your `.storybook/preview.ts` file.
