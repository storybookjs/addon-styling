import { logger, colors } from "@storybook/node-logger";
import type { AddonStylingOptions } from "../types";

export function viteFinal(config: any, options: AddonStylingOptions = {}) {
  if (options.cssModules) {
    logger.warn(
      `[@storybook/addon-styling] "${colors.blue(
        "options.cssModules"
      )}" is for webpack only. Vite comes preconfigured with css-module support.`
    );
  }
  if (options.cssBuildRule) {
    logger.warn(
      `[@storybook/addon-styling] "${colors.blue(
        "options.cssBuildRule"
      )}" is for webpack only. To customize your CSS build, update your Vite config.`
    );
  }

  if (options.postCss) {
    logger.warn(
      `[@storybook/addon-styling] "${colors.blue(
        "options.postCss"
      )}" is for webpack only. Vite comes preconfigured with PostCSS support.`
    );
  }

  if (options.sass) {
    logger.warn(
      `[@storybook/addon-styling] "${colors.blue(
        "options.sass"
      )}" is for webpack only. Vite comes preconfigured with Sass/Scss support.`
    );
  }
  if (options.scssBuildRule) {
    logger.warn(
      `[@storybook/addon-styling] "${colors.blue(
        "options.scssBuildRule"
      )}" is for webpack only. Vite comes preconfigured with Sass/Scss support.`
    );
  }

  if (options.less) {
    logger.warn(
      `[@storybook/addon-styling] "${colors.blue(
        "options.less"
      )}" is for webpack only. Vite comes preconfigured with Less support.`
    );
  }
  if (options.lessBuildRule) {
    logger.warn(
      `[@storybook/addon-styling] "${colors.blue(
        "options.lessBuildRule"
      )}" is for webpack only. Vite comes preconfigured with Less support.`
    );
  }

  return config;
}
