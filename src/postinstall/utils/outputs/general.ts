import { logger, colors } from "@storybook/node-logger";

import boxen from "boxen";
import dedent from "dedent";
import { ChangeSummary, SupportedStylingTools } from "src/postinstall/types";

export const printHeader = () => {
  logger.line();
  logger.plain(
    boxen(
      dedent`I'm the configuration helper for "${colors.pink.bold(
        "@storybook/addon-styling"
      )}"!

        Hold on for a moment while I look at your project and get you all set up.`,
      {
        title: "👋 Hi there",
        titleAlignment: "left",
        borderColor: "cyanBright",
        borderStyle: "double",
        padding: 1,
      }
    )
  );
  logger.line();
};

export interface ConfigSummary extends ChangeSummary {
  strategy: SupportedStylingTools;
}

const buildSummary = (summary: ConfigSummary) =>
  `${
    summary.strategy === "fallback"
      ? "I configured Storybook's Webpack as you asked."
      : `"${colors.blue.bold(
          summary.strategy
        )}" has been configured and will now work in your stories.`
  }

    ${colors.purple.bold("What I did:")}
${summary.changed.map((change) => `     - ${change}`).join("\n")}

    ${colors.purple.bold("Next steps:")}
${summary.nextSteps.map((step) => `     - ${step}`).join("\n")}`;

export const printScriptSummary = (summary: ConfigSummary) => {
  logger.line();
  logger.plain(
    boxen(buildSummary(summary), {
      title: "✨ Success!",
      titleAlignment: "left",
      borderColor: "green",
      borderStyle: "double",
      padding: 1,
    })
  );
  logger.line();
};
