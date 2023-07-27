import { PackageJson } from "@storybook/types";
import { logger } from "@storybook/node-logger";
import { readConfig } from "@storybook/csf-tools";

import type { ToolConfigurationStrategy } from "./postinstall/types";
import { getPackageJson } from "./postinstall/utils/package-json.utils";
import {
  findConfig,
  writePrettyConfig,
} from "./postinstall/utils/configs.utils";
import {
  Builder,
  buildStorybookProjectMeta,
} from "./postinstall/utils/dependencies.utils";
import {
  printError,
  printHeader,
  askUser,
  printScriptSummary,
  ConfigSummary,
} from "./postinstall/utils/outputs";
import { isGitClean } from "./postinstall/utils/git.utils";

import { tailwindStrategy } from "./postinstall/tailwind/tailwind.strategy";
import { fallbackStrategy } from "./postinstall/fallback/fallback.strategy";

const AUTO_CONFIG_STRATEGIES: ToolConfigurationStrategy[] = [tailwindStrategy];

const selectStrategy = (packageJson: PackageJson) =>
  AUTO_CONFIG_STRATEGIES.find(({ predicate }) => predicate(packageJson)) ??
  fallbackStrategy;

const automigrate = async () => {
  printHeader();

  const isGitDirty = (await isGitClean()) === false;

  if (isGitDirty) {
    const shouldQuit = await askUser.shouldQuitWithDirtyGit();
    if (shouldQuit) return;
  }

  // Step 1: Find path to Storybook config files
  const mainPath = await findConfig("main");
  const previewPath = await findConfig("preview");

  // Step 2: load package.json and Storybook config files
  const packageJson: PackageJson = getPackageJson();
  const mainConfig = await readConfig(mainPath);
  const previewConfig = await readConfig(previewPath);

  // Step 3: Build project meta
  const projectMeta = buildStorybookProjectMeta(mainConfig, packageJson);

  if (Builder.isNot.webpack(projectMeta)) {
    printError.unsupportedBuilder();
    return;
  }

  // Step 4: Determine configuration strategy
  const strategy = selectStrategy(packageJson);

  const summary: ConfigSummary = {
    strategy: strategy.name,
    changed: [],
    nextSteps: [],
  };

  // Step 5: Make any required updates to .storybook/main.ts
  if (strategy?.main) {
    const { changed, nextSteps } = await strategy?.main(
      mainConfig,
      projectMeta
    );
    await writePrettyConfig(mainConfig);
    logger.line();

    summary.changed.push(...changed);
    summary.nextSteps.push(...nextSteps);
  }

  // Step 6: Make any required updates to .storybook/preview.ts
  if (strategy?.preview) {
    // Make updates to preview
    const { changed, nextSteps } = await strategy?.preview(
      previewConfig,
      projectMeta
    );
    await writePrettyConfig(previewConfig);
    logger.line();

    summary.changed.push(...changed);
    summary.nextSteps.push(...nextSteps);
  }

  // Step 7: End of script
  printScriptSummary(summary);
};

automigrate();
