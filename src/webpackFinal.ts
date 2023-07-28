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
    let configRules = config.module?.rules;

    if (!configRules) {
      throw new Error(
        "webpackFinal received a rules option but config.module.rules is not an array"
      );
    }

    configRules = configRules
      // Remove any existing rules for styles
      .filter((rule) => typeof rule === "object" && !isRuleForStyles(rule));

    // Add the new rules for styles
    configRules.push(...rules);
  }

  return config;
}
