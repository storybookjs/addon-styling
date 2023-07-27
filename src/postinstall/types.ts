import { PackageJson } from "@storybook/types";
import type { ConfigFile } from "@storybook/csf-tools";

export const DEFAULT_CONFIGURATION_MAP = {
  cssModules: false,
  postcss: false,
  sass: false,
  less: false,
  vanillaExtract: false,
} as const;

export type ConfigurationKey = keyof typeof DEFAULT_CONFIGURATION_MAP;

export type ConfigurationMap = Record<ConfigurationKey, boolean>;

export const CONFIGURATION_KEY_TO_NAME: Record<ConfigurationKey, string> = {
  cssModules: "CSS Modules",
  postcss: "postcss",
  sass: "sass",
  less: "less",
  vanillaExtract: "vanilla-extract",
};

export const SUPPORTED_BUILDERS = {
  VITE: "vite",
  WEBPACK: "webpack",
} as const;

export type SupportedBuilders =
  (typeof SUPPORTED_BUILDERS)[keyof typeof SUPPORTED_BUILDERS];

export const SUPPORTED_STYLING_TOOLS = {
  TAILWIND: "tailwind",
  VANILLA_EXTRACT: "vanilla-extract",

  // Fallback scenario where no styling tool is found
  FALLBACK: "fallback",
} as const;

export type SupportedStylingTools =
  (typeof SUPPORTED_STYLING_TOOLS)[keyof typeof SUPPORTED_STYLING_TOOLS];

export interface StorybookProjectMeta {
  dependencies: PackageJson["dependencies"];
  devDependencies: PackageJson["devDependencies"];
  peerDependencies: PackageJson["peerDependencies"];
  builder: SupportedBuilders;
  framework: string;
}

export interface ChangeSummary {
  changed: string[];
  nextSteps: string[];
}

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
   * @param mainConfig Babel AST for the main.ts file
   * @param meta The project's meta information including the builder, framework, and dependencies
   */
  main?: (
    mainConfig: ConfigFile,
    meta: StorybookProjectMeta
  ) => Promise<ChangeSummary>;
  /**
   * Transform function for a `.storybook/preview.ts` file
   * @param previewConfig Babel AST for the preview.ts file
   * @param meta The project's meta information including the builder, framework, and dependencies
   */
  preview?: (
    previewConfig: ConfigFile,
    meta: StorybookProjectMeta
  ) => Promise<ChangeSummary>;
}
