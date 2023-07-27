import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";

export interface AddonStylingOptions {
  plugins?: WebpackConfig["plugins"];
  rules?: RuleSetRule[];
}
