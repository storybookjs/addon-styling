import fs from "node:fs";
import type { PackageJson } from "@storybook/types";

// Function to find the package.json file recursively starting from a given directory
function findPackageJson(directory: string): string | null {
  const filePath = `${directory}/package.json`;

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  const parentDir = directory.split("/").slice(0, -1).join("/");

  if (parentDir === "") {
    return null;
  }

  return findPackageJson(parentDir);
}

// Function to parse the package.json file
function parsePackageJson(filePath: string): PackageJson {
  const fileContents = fs.readFileSync(filePath, "utf-8");

  try {
    return JSON.parse(fileContents);
  } catch (error) {
    throw new Error(`Error parsing package.json: ${error}`);
  }
}

// Usage example
const startDirectory = process.cwd();
const packageJsonPath = findPackageJson(startDirectory);

if (packageJsonPath) {
  const packageJson = parsePackageJson(packageJsonPath);
} else {
  console.log(
    "No package.json found in the current directory or its ancestors."
  );
}

export function getPackageJson(): PackageJson | undefined {
  const directory = process.cwd();
  const packageJsonPath = findPackageJson(directory);

  if (packageJsonPath) {
    try {
      return parsePackageJson(packageJsonPath);
    } catch (e) {}
  }
}
