import { promisify } from "util";
import { execFile } from "child_process";

const exec = promisify(execFile);

/**
 *
 * @returns true if git is clean, false otherwise
 */
export const isGitClean = async () => {
  const { stdout } = await exec("git", ["status", "--porcelain"]);
  return stdout === "";
};
