import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";
import type { AddonStylingOptions } from "../types";

const isRuleForLESS = (rule: RuleSetRule) =>
  typeof rule !== "string" &&
  rule.test instanceof RegExp &&
  rule.test.test("test.less");

const buildStyleLoader = (options: AddonStylingOptions) => ({
  loader: require.resolve("style-loader"),
});

const buildCssLoader = ({ cssModules, postCss }: AddonStylingOptions) => {
  const importSettings = { importLoaders: postCss ? 2 : 1 };
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

const buildLessLoader = ({ less }: AddonStylingOptions) => {
  const implementationOptions =
    typeof less === "object" && less.hasOwnProperty("implementation")
      ? { implementation: less.implementation }
      : {};

  const additionalData =
    typeof less === "object" && less.hasOwnProperty("additionalData")
      ? { additionalData: less.additionalData }
      : {};

  return {
    loader: require.resolve("less-loader"),
    options: {
      sourceMap: true,
      lessOptions: less.lessOptions ?? {},
      ...implementationOptions,
      ...additionalData,
    },
  };
};

const LESS_FILE_REGEX = /\.less$/i;
const buildLessRule = (options: AddonStylingOptions): RuleSetRule => {
  if (options.scssBuildRule) return options.scssBuildRule;

  const buildRule = [
    buildStyleLoader(options),
    buildCssLoader(options),
    ...(options.postCss ? [buildPostCssLoader(options)] : []),
    buildLessLoader(options),
  ];
  return {
    test: LESS_FILE_REGEX,
    use: buildRule,
    sideEffects: true,
  };
};

export const patchOrAddLessRule = (
  config: WebpackConfig,
  options: AddonStylingOptions
): void => {
  // If the user doesn't want to patch webpack for postcss or css modules
  if (!options.less && !options.lessBuildRule) {
    // return without adjusting config
    return;
  }

  const rules = config.module?.rules;

  const rule = buildLessRule(options);
  const ruleIndex = rules?.findIndex(isRuleForLESS);

  if (ruleIndex === -1) {
    // If no existing css rule, add it
    rules?.push(rule);
  } else {
    // If existing css rule, replace it
    rules[ruleIndex] = rule;
  }
};
