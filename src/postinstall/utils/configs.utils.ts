import fs from "node:fs/promises";
import prettier from 'prettier';
import * as recast from 'recast';

import { logger } from "@storybook/node-logger";
import { type ConfigFile, readConfig } from "@storybook/csf-tools";

const SUPPORTED_EXTENSIONS = ["js", "ts", "tsx", "jsx"] as const;

export const findConfig = async (prefix: string) => {
  const filenames = SUPPORTED_EXTENSIONS.map(
    (ext) => `.storybook/${prefix}.${ext}`
  );
  const exists = await Promise.all(
    filenames.map(async (f) => {
      try {
        const stats = await fs.stat(f);
        return true;
      } catch (e) {
        return false;
      }
    })
  );

  const idx = exists.findIndex((e) => e);
  if (idx === -1) return filenames[0]; // create a JS file
  return filenames[idx];
};

export const getMainConfig = async (): Promise<ConfigFile> => {
  const mainPath = await findConfig("main");
  const mainConfig = await readConfig(mainPath);

  return mainConfig;
};

export const writePrettyConfig = async (config: ConfigFile): Promise<void> => {
  const fname = config.fileName;
  if (!fname) throw new Error('Please specify a fileName for writeConfig');

  let output = recast.print(config._ast, {}).code

  try {
    const prettierConfig = prettier.resolveConfig.sync('.', { editorconfig: true }) || {
      printWidth: 100,
      tabWidth: 2,
      bracketSpacing: true,
      trailingComma: 'es5',
      singleQuote: true,
    };

    output = prettier.format(output, { ...prettierConfig, filepath: fname });
  } catch (e) {
    logger.info(`Failed applying prettier to ${fname}.`);
  }

  await fs.writeFile(fname, output);
  

}


