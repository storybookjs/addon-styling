import type { RuleSetRule } from "webpack";
import { AddonStylingOptions } from "./types";

export const isRuleForCSS = (rule: RuleSetRule) =>
  typeof rule !== "string" &&
  rule.test instanceof RegExp &&
  rule.test.test("test.css");

const buildStyleLoader = (options: AddonStylingOptions) => ({
  loader: "style-loader",
});

const buildCssLoader = ({ cssModules, postCss }: AddonStylingOptions) => {
  const importSettings = postCss ? { importLoaders: 1 } : {};
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

const CSS_FILE_REGEX = /\.css$/;
export const buildCssRule = (options: AddonStylingOptions): RuleSetRule => {
  if (options.cssBuildRule) return options.cssBuildRule;

  const buildRule = [
    buildStyleLoader(options),
    buildCssLoader(options),
    ...(options.postCss ? [buildPostCssLoader(options)] : []),
  ];
  return {
    test: CSS_FILE_REGEX,
    use: buildRule,
  };
};
