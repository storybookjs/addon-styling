import { PackageJson } from "@storybook/types";
import type { ConfigFile } from "@storybook/csf-tools";
import { logger, colors } from "@storybook/node-logger";

interface NodeLogger {
  logger: typeof logger;
  colors: typeof colors;
}

export const SUPPORTED_BUILDERS = {
  VITE: "vite",
  WEBPACK: "webpack",
} as const;

export type SupportedBuilders =
  typeof SUPPORTED_BUILDERS[keyof typeof SUPPORTED_BUILDERS];

export const SUPPORTED_STYLING_TOOLS = {
  TAILWIND: "tailwind",
} as const;

export type SupportedStylingTools =
  typeof SUPPORTED_STYLING_TOOLS[keyof typeof SUPPORTED_STYLING_TOOLS];

export interface ToolConfigurationStrategy {
  /**
   * The name of the tool for configuration
   */
  name: SupportedStylingTools;
  /**
   * Predicate function to check if the project meets the requirements of this strategy
   * @param packageJson The project's package.json
   * @returns {boolean} whether the project has the tool
   */
  predicate: (packageJson: PackageJson) => Boolean;
  /**
   * Transform function for a `.storybook/main.ts` file
   * @param builder The builder used to build the project's stories
   * @param mainConfig Babel AST for the main.ts file
   * @param logger logging utilities
   */
  main?: (
    builder: SupportedBuilders,
    mainConfig: ConfigFile,
    logger: NodeLogger
  ) => void;
  /**
   * Transform function for a `.storybook/preview.ts` file
   * @param builder The builder used to build the project's stories
   * @param mainConfig Babel AST for the preview.ts file
   * @param logger logging utilities
   */
  preview?: (
    builder: SupportedBuilders,
    previewConfig: ConfigFile,
    logger: NodeLogger
  ) => void;
}
