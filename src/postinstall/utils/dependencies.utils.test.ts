import { describe, it } from "vitest";

import {
  hasDependency,
  needsCssModulesConfiguration,
  needsLessConfiguration,
  needsPostCssConfiguration,
  needsSassConfiguration,
} from "./dependencies.utils";

import { TEST_PACKAGE_JSON } from "./test.pkg";
import { SUPPORTED_BUILDERS } from "../types";

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
  });

  describe("HELPER: needsCssModulesConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for CSS Modules", ({
      expect,
    }) => {
      const result = needsCssModulesConfiguration(SUPPORTED_BUILDERS.WEBPACK);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for CSS Modules", ({
      expect,
    }) => {
      const result = needsCssModulesConfiguration(SUPPORTED_BUILDERS.VITE);

      expect(result).toBeFalsy();
    });
  });

  describe("HELPER: needsPostCssConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for PostCSS", ({
      expect,
    }) => {
      const result = needsPostCssConfiguration(SUPPORTED_BUILDERS.WEBPACK);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for PostCSS", ({
      expect,
    }) => {
      const result = needsPostCssConfiguration(SUPPORTED_BUILDERS.VITE);

      expect(result).toBeFalsy();
    });
  });

  describe("HELPER: needsSassConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for Sass", ({
      expect,
    }) => {
      const result = needsSassConfiguration(SUPPORTED_BUILDERS.WEBPACK);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for Sass", ({
      expect,
    }) => {
      const result = needsSassConfiguration(SUPPORTED_BUILDERS.VITE);

      expect(result).toBeFalsy();
    });
  });

  describe("HELPER: needsLessConfiguration", () => {
    it("TRUE: should return true if given a builder that needs to be configured for Less", ({
      expect,
    }) => {
      const result = needsLessConfiguration(SUPPORTED_BUILDERS.WEBPACK);

      expect(result).toBeTruthy();
    });

    it("FALSE: should return true if given a builder that doesn't need to be configured for Less", ({
      expect,
    }) => {
      const result = needsLessConfiguration(SUPPORTED_BUILDERS.VITE);

      expect(result).toBeFalsy();
    });
  });
});
