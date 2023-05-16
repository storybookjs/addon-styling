import type { PackageJson } from "@storybook/types";
import type { ConfigFile } from "@storybook/csf-tools";
import { SUPPORTED_BUILDERS, SupportedBuilders } from "../types";

export const hasDependency = (
  packageJson: PackageJson,
  depName: string
): boolean =>
  Boolean(
    packageJson?.dependencies[depName] || packageJson?.devDependencies[depName]
  );

export const determineBuilder = (mainConfig: ConfigFile): SupportedBuilders => {
  const frameworkValue = mainConfig.getFieldValue(["framework"]);

  const framework = (frameworkValue?.name || frameworkValue) as string;

  return framework.includes("vite") || framework.includes("sveltekit")
    ? SUPPORTED_BUILDERS.VITE
    : SUPPORTED_BUILDERS.WEBPACK;
};

export const needsCssModulesConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsPostCssConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsSassConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsLessConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
