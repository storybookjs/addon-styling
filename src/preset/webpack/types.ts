import type { RuleSetRule } from "webpack";

export interface AddonStylingOptions {
  postCss?: boolean | object;
  cssModules?: boolean;
  cssBuildRule?: RuleSetRule;
}
