import type { PackageJson } from "@storybook/types";
import type { ConfigFile } from "@storybook/csf-tools";
import {
  SUPPORTED_BUILDERS,
  StorybookProjectMeta,
  SupportedBuilders,
} from "../types";

const pluckDependencies = ({
  dependencies = {},
  devDependencies = {},
  peerDependencies = {},
}: PackageJson) => ({ dependencies, devDependencies, peerDependencies });

export const hasDependency = (
  {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
  }: PackageJson | StorybookProjectMeta,
  depName: string
): boolean =>
  !!dependencies[depName] ||
  !!devDependencies[depName] ||
  !!peerDependencies[depName];

const getFramework = (mainConfig: ConfigFile): string => {
  const frameworkValue = mainConfig.getFieldValue(["framework"]);

  return typeof frameworkValue === "string"
    ? frameworkValue
    : frameworkValue?.name;
};

const determineBuilder = (mainConfig: ConfigFile): SupportedBuilders => {
  const framework = getFramework(mainConfig);

  return framework.includes("vite") || framework.includes("sveltekit")
    ? SUPPORTED_BUILDERS.VITE
    : SUPPORTED_BUILDERS.WEBPACK;
};

export const buildStorybookProjectMeta = (
  mainConfig: ConfigFile,
  packageJson: PackageJson
): StorybookProjectMeta => ({
  ...pluckDependencies(packageJson),
  builder: determineBuilder(mainConfig),
  framework: getFramework(mainConfig),
});

const isAngular = ({ framework }: StorybookProjectMeta): boolean =>
  framework.includes("angular");
const isNextJs = ({ framework }: StorybookProjectMeta): boolean =>
  framework.includes("nextjs");

export const Frameworks = {
  isAngular,
  isNextJs,
};

const isWebpack = ({ builder }: StorybookProjectMeta): boolean =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
const isVite = ({ builder }: StorybookProjectMeta): boolean =>
  builder === SUPPORTED_BUILDERS.VITE;

export const Builders = {
  isWebpack,
  isVite,
};

export const needsCssModulesConfiguration = ({
  builder,
}: StorybookProjectMeta) => builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsPostCssConfiguration = ({ builder }: StorybookProjectMeta) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsSassConfiguration = ({ builder }: StorybookProjectMeta) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
export const needsLessConfiguration = ({ builder }: StorybookProjectMeta) =>
  builder === SUPPORTED_BUILDERS.WEBPACK;
