import type { RuleSetRule } from "webpack";

export interface AddonStylingOptions {
  postCss?: boolean | object;
  sass?: boolean | object;
  cssModules?: boolean;
  cssBuildRule?: RuleSetRule;
  scssBuildRule?: RuleSetRule;
}
