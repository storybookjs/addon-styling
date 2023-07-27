import { logger, colors } from "@storybook/node-logger";
import boxen from "boxen";

const printUnsupportedBuilderError = () => {
  logger.line();
  logger.plain(
    boxen(
      `"${colors.green.bold(
        "@storybook/addon-styling"
      )}" is for webpack projects only.\nPlease remove it from your project to avoid unneeded dependencies.`,
      {
        title: "🚨 ERROR: Unsupported builder",
        borderColor: "red",
        borderStyle: "double",
        padding: 1,
      }
    )
  );
  logger.line();
};

export const printError = {
  unsupportedBuilder: printUnsupportedBuilderError,
};
