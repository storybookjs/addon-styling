import fs from "node:fs/promises";
import * as recast from "recast";

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

export const formatFileContents = (config: ConfigFile): string => {
  const fname = config.fileName;
  if (!fname) throw new Error("Please specify a fileName for writeConfig");

  let output = recast.print(config._ast, {}).code;

  return output;
};

export const writePrettyConfig = async (config: ConfigFile): Promise<void> => {
  const fname = config.fileName;
  const output = formatFileContents(config);

  await fs.writeFile(fname, output);
};
