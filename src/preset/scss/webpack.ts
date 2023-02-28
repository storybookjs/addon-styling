import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";
import type { AddonStylingOptions } from "../types";

const isRuleForSCSS = (rule: RuleSetRule) =>
  typeof rule !== "string" &&
  rule.test instanceof RegExp &&
  (rule.test.test("test.scss") || rule.test.test("test.sass"));

const buildStyleLoader = (options: AddonStylingOptions) => ({
  loader: "style-loader",
});

const buildCssLoader = ({ cssModules, postCss }: AddonStylingOptions) => {
  const importSettings = { importLoaders: postCss ? 3 : 2 };
  const moduleSettings = cssModules ? { modules: "auto" } : {};

  return {
    loader: "css-loader",
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
    loader: "postcss-loader",
    options: {
      ...implementationOptions,
    },
  };
};

const buildUrlResolverLoader = (options: AddonStylingOptions) => ({
  loader: "url-resolver-loader",
});

const buildSassLoader = ({ sass }: AddonStylingOptions) => {
  const sassOptions = typeof sass === "object" ? { sassOptions: sass } : {};

  const implementationOptions =
    typeof sass === "object" && sass.hasOwnProperty("implementation")
      ? // @ts-expect-error
        { implementation: sass.implementation }
      : {};

  const additionalData =
    typeof sass === "object" &&
    (sass.hasOwnProperty("prependData") ||
      sass.hasOwnProperty("additionalData"))
      ? // @ts-expect-error
        { additionalData: sass.prependData || sass.additionalData }
      : {};

  return {
    loader: "sass-loader",
    options: {
      sourceMap: true,
      ...sassOptions,
      ...implementationOptions,
      ...additionalData,
    },
  };
};

const SCSS_FILE_REGEX = /\.s[ac]ss$/;
const buildScssRule = (options: AddonStylingOptions): RuleSetRule => {
  if (options.scssBuildRule) return options.scssBuildRule;

  const buildRule = [
    buildStyleLoader(options),
    buildCssLoader(options),
    ...(options.postCss ? [buildPostCssLoader(options)] : []),
    buildUrlResolverLoader(options),
    buildSassLoader(options),
  ];
  return {
    test: SCSS_FILE_REGEX,
    use: buildRule,
  };
};

export const patchOrAddScssRule = (
  config: WebpackConfig,
  options: AddonStylingOptions
): void => {
  // If the user doesn't want to patch webpack for postcss or css modules
  if (
    !options.cssModules &&
    !options.postCss &&
    !options.sass &&
    !options.scssBuildRule
  ) {
    // return without adjusting config
    return;
  }

  const rules = config.module?.rules;

  const rule = buildScssRule(options);
  const ruleIndex = rules?.findIndex(isRuleForSCSS);

  if (ruleIndex === -1) {
    // If no existing css rule, add it
    rules?.push(rule);
  } else {
    // If existing css rule, replace it
    rules[ruleIndex] = rule;
  }
};
