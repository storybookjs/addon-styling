import { describe, it } from "vitest";

import {
  hasDependency,
  needsCssModulesConfiguration,
  needsLessConfiguration,
  needsPostCssConfiguration,
  needsSassConfiguration,
} from "./dependencies.utils";

import { TEST_PACKAGE_JSON } from "../fixtures/package.fixture";
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from "../types";

describe("POSTINSTALL UTILITIES", () => {
  describe("HELPER: hasDependency", () => {
    it('TRUE: should return true if given dependency name is in "package.json"', ({
      expect,
    }) => {
      const result = hasDependency(TEST_PACKAGE_JSON, "tailwindcss");

      expect(result).toBeTruthy();
    });

    it('FALSE: should return false if given dependency name is not in "package.json"', ({
      expect,
    }) => {
      const result = hasDependency(TEST_PACKAGE_JSON, "fakejs");

      expect(result).toBeFalsy();
    });

    it('MISSING DEPS MAP: it should not throw an error if the given "package.json" doesn\'t include a deps map', ({
      expect,
    }) => {
      const { dependencies, devDependencies, peerDependencies, ...pkgJson } =
        TEST_PACKAGE_JSON;
      const result = hasDependency(pkgJson, "fakejs");

      expect(result).toBeFalsy();
    });
  });

  describe("HELPER: needsCssModulesConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for CSS Modules", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.WEBPACK,
        framework: "react-webpack5",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };

      const result = needsCssModulesConfiguration(meta);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for CSS Modules", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.VITE,
        framework: "react-vite",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };
      const result = needsCssModulesConfiguration(meta);

      expect(result).toBeFalsy();
    });
  });

  describe("HELPER: needsPostCssConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for PostCSS", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.WEBPACK,
        framework: "react-webpack5",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };
      const result = needsPostCssConfiguration(meta);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for PostCSS", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.VITE,
        framework: "react-vite",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };
      const result = needsPostCssConfiguration(meta);

      expect(result).toBeFalsy();
    });
  });

  describe("HELPER: needsSassConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for Sass", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.WEBPACK,
        framework: "react-webpack5",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };
      const result = needsSassConfiguration(meta);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for Sass", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.VITE,
        framework: "react-vite",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };
      const result = needsSassConfiguration(meta);

      expect(result).toBeFalsy();
    });
  });

  describe("HELPER: needsLessConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for Less", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.WEBPACK,
        framework: "react-webpack5",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };
      const result = needsLessConfiguration(meta);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for Less", ({
      expect,
    }) => {
      const meta = {
        builder: SUPPORTED_BUILDERS.VITE,
        framework: "react-vite",
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      };
      const result = needsLessConfiguration(meta);

      expect(result).toBeFalsy();
    });
  });
});
