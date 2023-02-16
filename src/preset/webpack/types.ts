import type { RuleSetRule } from "webpack";

export interface AddonStylingOptions {
  usePostCss?: boolean;
  postCssImplementation?: unknown;
  useCssModules?: boolean;
  cssBuildRule?: RuleSetRule;
}
