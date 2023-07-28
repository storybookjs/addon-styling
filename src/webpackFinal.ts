import { logger, colors } from "@storybook/node-logger";
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
  logger.info(
    `=> [${colors.pink.bold(
      "@storybook/addon-styling"
    )}] Applying custom Storybook webpack configuration styling.`
  );
  if (plugins && plugins.length) {
    logger.info(
      `=> [${colors.pink.bold(
        "@storybook/addon-styling"
      )}] Adding given plugins to Storybook webpack configuration.`
    );
    config.plugins = config.plugins || [];
    config.plugins.push(...plugins);
  }

  if (rules && rules.length) {
    logger.info(
      `=> [${colors.pink.bold(
        "@storybook/addon-styling"
      )}] Replacing Storybook's webpack rules for styles with given rules.`
    );

    if (!config.module?.rules) {
      throw new Error(
        "webpackFinal received a rules option but config.module.rules is not an array"
      );
    }

    // Remove any existing rules for styles
    config.module.rules = config.module.rules.filter(
      (rule) => typeof rule === "object" && !isRuleForStyles(rule)
    );

    // Add the new rules for styles
    config.module.rules?.push(...rules);
  }

  return config;
}
