import type { RuleSetRule } from "webpack";

interface LessConfig {
  lessOptions?: Record<string, any>;
  implementation?: string;
  additionalData?: unknown;
}

export interface AddonStylingOptions {
  cssBuildRule?: RuleSetRule;
  css?: Record<string, any>;
  cssModules?: boolean | Record<string, any>;
  less?: LessConfig;
  lessBuildRule?: RuleSetRule;
  postCss?: boolean | object;
  sass?: boolean | object;
  scssBuildRule?: RuleSetRule;
}
