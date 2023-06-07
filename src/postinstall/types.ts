import { PackageJson } from "@storybook/types";
import type { ConfigFile } from "@storybook/csf-tools";

export const SUPPORTED_BUILDERS = {
  VITE: "vite",
  WEBPACK: "webpack",
} as const;

export type SupportedBuilders =
  typeof SUPPORTED_BUILDERS[keyof typeof SUPPORTED_BUILDERS];

export const SUPPORTED_STYLING_TOOLS = {
  TAILWIND: "tailwind",
  MATERIAL_UI: "material-ui",
  SASS: "sass",
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
   * @param mainConfig Babel AST for the main.ts file
   * @param packageJson The project's package.json
   * @param builder The builder used to build the project's stories
   */
  main?: (
    mainConfig: ConfigFile,
    packageJson: PackageJson,
    builder: SupportedBuilders
  ) => void;
  /**
   * Transform function for a `.storybook/preview.ts` file
   * @param previewConfig Babel AST for the preview.ts file
   * @param packageJson The project's package.json
   * @param builder The builder used to build the project's stories
   */
  preview?: (
    previewConfig: ConfigFile,
    packageJson: PackageJson,
    builder: SupportedBuilders
  ) => void;
}
