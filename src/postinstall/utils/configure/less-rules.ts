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
    importLoaders: ${postcss ? "2" : "1"},`;

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

export const generateLessRules = (configMap: ConfigurationMap): string =>
  configMap.less
    ? dedent`
    {
        test: /\\.less$/,
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
            {
                loader: require.resolve("less-loader"),
                options: {
                    // Want to add more Less options? Read more here: https://webpack.js.org/loaders/less-loader/#options
                    implementation: require.resolve("less"),
                    sourceMap: true,
                    lessOptions: {},
                },
            },
        ],
    },
    `
    : "";
