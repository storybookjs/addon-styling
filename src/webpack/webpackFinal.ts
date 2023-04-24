import type { Configuration as WebpackConfig } from "webpack";
import type { AddonStylingOptions } from "./types";

import { patchOrAddCssRule } from "./css/webpack";
import { patchOrAddScssRule } from "./scss/webpack";
import { patchOrAddLessRule } from "./less/webpack";

export function webpackFinal(
  config: WebpackConfig,
  options: AddonStylingOptions = {}
) {
  patchOrAddCssRule(config, options);
  patchOrAddScssRule(config, options);
  patchOrAddLessRule(config, options);

  return config;
}
