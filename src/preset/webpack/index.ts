import type { Configuration as WebpackConfig } from "webpack";

import { buildCssRule, isRuleForCSS } from "./helpers";
import type { AddonStylingOptions } from "./types";

export async function webpackFinal(
  config: WebpackConfig,
  options: AddonStylingOptions = {}
) {
  // If the user doesn't want to patch webpack for postcss or css modules
  if (!options.usePostCss && !options.useCssModules) {
    // return config unchanged
    return config;
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

  return config;
}
