import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";
import type { AddonStylingOptions } from "./types";

export const isRuleForStyles = (rule: RuleSetRule) =>
  rule.test instanceof RegExp &&
  (rule.test.test("test.css") ||
    rule.test.test("test.scss") ||
    rule.test.test("test.less"));

export function webpackFinal(
  config: WebpackConfig,
  { rules, plugins }: AddonStylingOptions = {}
) {
  if (plugins) {
    config.plugins = config.plugins || [];
    config.plugins.push(...plugins);
  }

  if (rules) {
    config?.module?.rules
      // Remove any existing rules for styles
      .filter((rule) => typeof rule === "object" && !isRuleForStyles(rule))
      // Add the new rules for styles
      .push(...rules);
  }

  return config;
}
