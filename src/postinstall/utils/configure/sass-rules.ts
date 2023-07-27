import dedent from "dedent";

import { ConfigurationMap } from "src/postinstall/types";

const cssModuleOptions = ({ cssModules }: ConfigurationMap): string =>
  cssModules
    ? dedent`
    // Want to add more CSS Modules options? Read more here: https://github.com/webpack-contrib/css-loader#modules
    modules: {
        auto: true,
    },`
    : "";

const importLoadersOptions = ({ postcss }: ConfigurationMap): string => dedent`
    importLoaders: ${postcss ? "3" : "2"},`;

const postcssLoader = ({ postcss }: ConfigurationMap): string =>
  postcss
    ? dedent`
{
    loader: require.resolve("postcss-loader"),
    options: {
        implementation: require.resolve("postcss"),
    },
},`
    : "";

export const generateSassRules = (configMap: ConfigurationMap): string =>
  configMap.sass
    ? dedent`
    {
        test: /\\.s[ac]ss$/,
        sideEffects: true,
        use: [
            require.resolve("style-loader"),
            {
                loader: require.resolve("css-loader"),
                options: {
                    ${cssModuleOptions(configMap)}
                    ${importLoadersOptions(configMap)}
                },
            },${postcssLoader(configMap)}
            require.resolve("resolve-url-loader"),
            {
                loader: require.resolve("sass-loader"),
                options: {
                    // Want to add more Sass options? Read more here: https://webpack.js.org/loaders/sass-loader/#options
                    implementation: require.resolve("sass"),
                    sourceMap: true,
                    sassOptions: {},
                },
            },
        ],
    },
    `
    : "";
