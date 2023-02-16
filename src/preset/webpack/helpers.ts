import type { RuleSetRule } from "webpack";
import { AddonStylingOptions } from "./types";

export const isRuleForCSS = (rule: RuleSetRule) =>
  typeof rule !== "string" &&
  rule.test instanceof RegExp &&
  rule.test.test("test.css");

const buildStyleLoader = (options: AddonStylingOptions) => ({
  loader: "style-loader",
});

const buildCssLoader = ({ useCssModules, usePostCss }: AddonStylingOptions) => {
  const importSettings = usePostCss ? { importLoaders: 1 } : {};
  const moduleSettings = useCssModules ? { modules: "auto" } : {};

  return {
    loader: "css-loader",
    options: {
      ...importSettings,
      ...moduleSettings,
    },
  };
};

const buildPostCssLoader = ({
  postCssImplementation: implementation,
}: AddonStylingOptions) => {
  const implementationOptions = implementation ? { implementation } : {};

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
    ...(options.usePostCss ? [buildPostCssLoader(options)] : []),
  ];
  return {
    test: CSS_FILE_REGEX,
    use: buildRule,
  };
};
