import { PackageJson } from "@storybook/types";
import type { ConfigFile } from "@storybook/csf-tools";

export const SUPPORTED_BUILDERS = {
  VITE: "vite",
  WEBPACK: "webpack",
} as const;

export type SupportedBuilders =
  (typeof SUPPORTED_BUILDERS)[keyof typeof SUPPORTED_BUILDERS];

export const SUPPORTED_STYLING_TOOLS = {
  EMOTION: "emotion",
  MATERIAL_UI: "material-ui",
  SASS: "sass",
  STYLED_COMPONENTS: "styled-components",
  TAILWIND: "tailwind",
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
  main?: (mainConfig: ConfigFile, meta: StorybookProjectMeta) => void;
  /**
   * Transform function for a `.storybook/preview.ts` file
   * @param previewConfig Babel AST for the preview.ts file
   * @param meta The project's meta information including the builder, framework, and dependencies
   */
  preview?: (previewConfig: ConfigFile, meta: StorybookProjectMeta) => void;
}
