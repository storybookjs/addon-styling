import type { PackageJson } from "@storybook/types";
import type { ConfigFile } from "@storybook/csf-tools";
import { SUPPORTED_BUILDERS, SupportedBuilders } from "../types";

export const hasDependency = (
  packageJson: PackageJson,
  depName: string
): boolean => {
  const deps = packageJson?.dependencies || {};
  const devDeps = packageJson?.devDependencies || {};
  const peerDeps = packageJson?.peerDependencies || {};

  return !!deps[depName] || !!devDeps[depName] || !!peerDeps[depName];
};

export const getFramework = (mainConfig: ConfigFile): string => {
  const frameworkValue = mainConfig.getFieldValue(["framework"]);

  return typeof frameworkValue === "string"
    ? frameworkValue
    : frameworkValue?.name;
};

export const determineBuilder = (mainConfig: ConfigFile): SupportedBuilders => {
  const framework = getFramework(mainConfig);

  return framework.includes("vite") || framework.includes("sveltekit")
    ? SUPPORTED_BUILDERS.VITE
    : SUPPORTED_BUILDERS.WEBPACK;
};

export const isAngular = (mainConfig: ConfigFile): boolean => {
  const framework = getFramework(mainConfig);

  return framework.includes("angular");
};

export const isNextJs = (mainConfig: ConfigFile): boolean => {
  const framework = getFramework(mainConfig);

  return framework.includes("nextjs");
};

export const needsCssModulesConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsPostCssConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsSassConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsLessConfiguration = (builder: SupportedBuilders) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
