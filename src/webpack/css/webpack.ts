import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";
import type { AddonStylingOptions } from "../../types";

const isRuleForCSS = (rule: RuleSetRule) =>
  typeof rule !== "string" &&
  rule.test instanceof RegExp &&
  rule.test.test("test.css");

const buildStyleLoader = (options: AddonStylingOptions) => ({
  loader: require.resolve("style-loader"),
});

const buildCssLoader = ({ cssModules, postCss }: AddonStylingOptions) => {
  const importSettings = postCss ? { importLoaders: 1 } : {};
  const moduleSettings = cssModules ? { modules: { auto: true } } : {};

  return {
    loader: require.resolve("css-loader"),
    options: {
      ...importSettings,
      ...moduleSettings,
    },
  };
};

const buildPostCssLoader = ({ postCss }: AddonStylingOptions) => {
  const implementationOptions =
    typeof postCss === "object" ? { ...postCss } : {};

  return {
    loader: require.resolve("postcss-loader"),
    options: {
      ...implementationOptions,
    },
  };
};

const CSS_FILE_REGEX = /\.css$/;
const buildCssRule = (options: AddonStylingOptions): RuleSetRule => {
  if (options.cssBuildRule) return options.cssBuildRule;

  const buildRule = [
    buildStyleLoader(options),
    buildCssLoader(options),
    ...(options.postCss ? [buildPostCssLoader(options)] : []),
  ];
  return {
    test: CSS_FILE_REGEX,
    use: buildRule,
    sideEffects: true,
  };
};

export const patchOrAddCssRule = (
  config: WebpackConfig,
  options: AddonStylingOptions
): void => {
  // If the user doesn't want to patch webpack for postcss or css modules
  if (!options.postCss && !options.cssModules && !options.cssBuildRule) {
    // return without adjusting config
    return;
  }

  const rules = config.module?.rules;

  const cssRule = buildCssRule(options);
  const ruleIndex = rules?.findIndex(isRuleForCSS);

  if (ruleIndex === -1) {
    // If no existing css rule, add it
    rules?.push(cssRule);
  } else {
    // If existing css rule, replace it
    rules[ruleIndex] = cssRule;
  }
};
