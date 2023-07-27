import { logger, colors } from "@storybook/node-logger";
import boxen from "boxen";
import prompts from "prompts";
import dedent from "dedent";
import {
  ConfigurationMap,
  DEFAULT_CONFIGURATION_MAP,
} from "src/postinstall/types";

const shouldQuitWithDirtyGit = async (): Promise<boolean> => {
  logger.plain(
    boxen(
      dedent`It looks like you have ${colors.red.bold(
        "uncommitted changes"
      )} in your git repository.
      
      We recommend that you commit or stash them before running this command.`,
      {
        title: "💬 Before we continue",
        borderColor: "yellow",
        borderStyle: "double",
        padding: 1,
      }
    )
  );
  logger.line();

  const { shouldQuit } = await prompts({
    type: "confirm",
    name: "shouldQuit",
    message: "Do you want to quit?",
    initial: true,
  });

  return shouldQuit;
};

export const whatToConfigure = async (): Promise<ConfigurationMap> => {
  logger.line();
  logger.plain(
    boxen(
      `I didn't recognize any styling tools in your project that I know how to configure.
Here's a list of things I know how to configure...`,
      {
        title: "💬 I need your help",
        borderColor: "yellow",
        borderStyle: "double",
        padding: 1,
      }
    )
  );
  logger.line();

  const { configurations } = await prompts({
    type: "multiselect",
    name: "configurations",
    message: "Select the styling tools that I should configure",
    instructions: false,
    choices: [
      { title: "CSS Modules", value: "cssModules" },
      { title: "PostCSS", value: "postcss" },
      { title: "Sass", value: "sass" },
      { title: "Less", value: "less" },
      { title: "Vanilla Extract", value: "vanillaExtract" },
    ],
    hint: "- Space to select. Return to submit",
  });

  const configMap = configurations.reduce(
    (map: ConfigurationMap, key: keyof ConfigurationMap) => {
      map[key] = true;
      return map;
    },
    DEFAULT_CONFIGURATION_MAP as ConfigurationMap
  );

  return configMap;
};

export const askUser = {
  shouldQuitWithDirtyGit,
  whatToConfigure,
};
