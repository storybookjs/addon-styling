import { PackageJson } from "@storybook/types";
import { logger, colors } from "@storybook/node-logger";
import { readConfig } from "@storybook/csf-tools";

import type { ToolConfigurationStrategy } from "./postinstall/types";
import { getPackageJson } from "./postinstall/utils/package-json.utils";
import {
  findConfig,
  writePrettyConfig,
} from "./postinstall/utils/configs.utils";
import { determineBuilder } from "./postinstall/utils/dependencies.utils";

import { tailwindStrategy } from "./postinstall/tailwind/tailwind.strategy";
import { materialUIStrategy } from "./postinstall/material-ui/material-ui.strategy";
import { sassStrategy } from "./postinstall/sass/sass.strategy";

const AUTO_CONFIG_STRATEGIES: ToolConfigurationStrategy[] = [
  tailwindStrategy,
  materialUIStrategy,
  sassStrategy,
];

const selectStrategy = (packageJson: PackageJson) =>
  AUTO_CONFIG_STRATEGIES.find(({ predicate }) => predicate(packageJson));

const automigrate = async () => {
  logger.plain(`
=========================================

 🧰 Configuring ${colors.pink.bold("@storybook/addon-styling")}

=========================================
`);

  const packageJson: PackageJson = getPackageJson();
  const strategy = selectStrategy(packageJson);

  const mainPath = await findConfig("main");
  const mainConfig = await readConfig(mainPath);

  const builder = determineBuilder(mainConfig);

  const previewPath = await findConfig("preview");
  const previewConfig = await readConfig(previewPath);

  if (!strategy) {
    logger.plain(
      `📣 ${colors.orange.bold(
        "No supported tool detected. Skipping auto-configuration."
      )}
      
  Check out the documentation for how to manually configure the addon.
  ${colors.pink("https://storybook.js.org/addons/@storybook/addon-styling/")}`
    );
    return;
  }

  // Step 1: Determine project details
  logger.plain(`${colors.blue.bold("(1/3)")} Project summary`);
  logger.plain(`  • Built with ${colors.green.bold(builder)}`);
  logger.plain(`  • Styled with ${colors.green.bold(strategy.name)}`);
  logger.line(1);

  // Step 2: Make any required updates to .storybook/main.ts
  logger.plain(`${colors.blue.bold("(2/3)")} ${colors.purple.bold(mainPath)}`);
  if (strategy.main) {
    strategy.main(mainConfig, packageJson, builder, { logger, colors });
    await writePrettyConfig(mainConfig);
  } else {
    logger.plain(`  • No updates required.`);
  }
  logger.line(1);

  // Step 3: Make any required updates to .storybook/preview.ts
  logger.plain(
    `${colors.blue.bold("(3/3)")} ${colors.purple.bold(previewPath)}`
  );
  if (strategy.preview) {
    // Make updates to preview
    strategy.preview(previewConfig, packageJson, builder, { logger, colors });
    await writePrettyConfig(previewConfig);
  } else {
    logger.plain(`  • No updates required.`);
  }
  logger.line(1);

  // Step 4: Profit
  logger.plain("✨ Done");
};

automigrate();
