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
  name: SupportedStylingTools;
  predicate: (packageJson: PackageJson) => Boolean;
  main?: (
    builder: SupportedBuilders,
    mainConfig: ConfigFile,
    logger: NodeLogger
  ) => void;
  preview?: (
    builder: SupportedBuilders,
    previewConfig: ConfigFile,
    logger: NodeLogger
  ) => void;
}
