import { beforeEach, describe, it } from "vitest";
import {
  isRuleForCSS,
  buildStyleLoader,
  buildCssModuleRules,
  buildCssLoader,
  buildPostCssLoader,
  patchOrAddCssRule,
  CSS_FILE_REGEX,
} from "./webpack";

import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";

describe("WEBPACK/CSS: configuration builders for css files", () => {
  describe("UTILITY: isRuleForCSS", () => {
    it("TRUE: it should return true when given a webpack rule for css files", async ({
      expect,
    }) => {
      const webpackRule: RuleSetRule = {
        test: /\.css$/i,
        use: [],
      };
      const result = isRuleForCSS(webpackRule);

      expect(result).toBeTruthy();
    });

    it("FALSE: it should return false when given a webpack rule for other file types", async ({
      expect,
    }) => {
      const someWebpackRule: RuleSetRule = {
        test: /\.svg$/i,
        use: [],
      };
      const someResult = isRuleForCSS(someWebpackRule);

      const otherWebpackRule: RuleSetRule = {
        test: /\.svg$/i,
        use: [],
      };
      const otherResult = isRuleForCSS(otherWebpackRule);

      expect(someResult).toBeFalsy();
      expect(otherResult).toBeFalsy();
    });
  });

  describe("UTILITY: buildStyleLoader", () => {
    it("it should return a style-loader object", async ({ expect }) => {
      const result = buildStyleLoader({});

      expect(result).toHaveProperty("loader");
      expect(result.loader).toEqual(require.resolve("style-loader"));
    });
  });

  describe("UTILITY: buildCssModuleRules", () => {
    it("NO MODULE RULES: it should return an empty object when no module rules are given", async ({
      expect,
    }) => {
      const result = buildCssModuleRules({});

      expect(result).toMatchObject({});
    });

    it('BASIC: it should return a minimal config for css modules when given "{ cssModules: true }"', async ({
      expect,
    }) => {
      const result = buildCssModuleRules({ cssModules: true });

      expect(result).toMatchObject({ modules: { auto: true } });
    });

    it("CUSTOM: it should return a custom config for css modules when given custom rules", async ({
      expect,
    }) => {
      const customRules = {
        auto: true,
        namedExport: true,
        getLocalIdent: (context, localIdentName, localName, options) => {
          return "whatever_random_class_name";
        },
      };

      const result = buildCssModuleRules({ cssModules: { ...customRules } });

      expect(result).toMatchObject({ modules: customRules });
    });
  });

  describe("UTILITY: buildCssLoader", () => {
    const BASE_LOADER = {
      loader: require.resolve("css-loader"),
      options: {},
    };

    it("NO ADDON OPTIONS: it should return a css-loader with no options", async ({
      expect,
    }) => {
      const result = buildCssLoader({});

      expect(result).toMatchObject(BASE_LOADER);
    });

    it("POSTCSS ENABLED: it should configure the css-loader to handle imports AFTER postcss", async ({
      expect,
    }) => {
      const expected = {
        ...BASE_LOADER,
        options: { importLoaders: 1 },
      };

      const result = buildCssLoader({
        postCss: { implementation: require.resolve("postcss") },
      });

      expect(result).toMatchObject(expected);
    });

    it("CSS MODULES ENABLED: it should configure the css-loader to support css-modules", async ({
      expect,
    }) => {
      const expected = {
        ...BASE_LOADER,
        options: { modules: { auto: true } },
      };

      const result = buildCssLoader({
        cssModules: true,
      });

      expect(result).toMatchObject(expected);
    });

    it("CSS MODULES & POSTCSS ENABLED: it should configure the css-loader to support css-modules and postcss", async ({
      expect,
    }) => {
      const expected = {
        ...BASE_LOADER,
        options: { modules: { auto: true }, importLoaders: 1 },
      };

      const result = buildCssLoader({
        cssModules: true,
        postCss: { implementation: require.resolve("postcss") },
      });

      expect(result).toMatchObject(expected);
    });
  });

  describe("UTILITY: buildPostCssLoader", () => {
    it("it should return a postcss-loader object", async ({ expect }) => {
      const result = buildPostCssLoader({});

      expect(result).toHaveProperty("loader");
      expect(result.loader).toEqual(require.resolve("postcss-loader"));
    });

    it("IMPLEMENTATION: it should return a postcss-loader with a given implementation of postcss", async ({
      expect,
    }) => {
      const result = buildPostCssLoader({
        postCss: { implementation: require.resolve("postcss") },
      });

      expect(result).toHaveProperty("loader");
      expect(result.loader).toEqual(require.resolve("postcss-loader"));
    });
  });

  describe("UTILITY: patchOrAddCssRule", () => {
    const EXISTING_CSS_RULES = {
      test: CSS_FILE_REGEX,
      use: ["style-loader", "css-loader"],
    };

    const createTestWebpackConfig = (id: string): WebpackConfig => ({
      name: `testConfig-${id}`,
      module: {
        rules: [EXISTING_CSS_RULES],
      },
    });

    it("NO CONFIGURATION: it should leave existing css rules alone if no configuration is given", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("default");

      patchOrAddCssRule(config, {});

      expect(config.module.rules).toContainEqual(EXISTING_CSS_RULES);
    });

    it("ENABLE POSTCSS: it should replace existing css rules to enable postcss", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("postcss");

      patchOrAddCssRule(config, {
        postCss: { implementation: require.resolve("postcss") },
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_CSS_RULES);
    });

    it("ENABLE CSS MODULES: it should replace existing css rules to enable css modules", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("postcss");

      patchOrAddCssRule(config, {
        cssModules: true,
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_CSS_RULES);
    });

    it("ENABLE POSTCSS & CSS MODULES: it should replace existing css rules to enable postcss & css modules", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("complex");

      patchOrAddCssRule(config, {
        postCss: { implementation: require.resolve("postcss") },
        cssModules: true,
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules[0]?.sideEffects).toBeTruthy();
      expect(config.module.rules).not.toContain(EXISTING_CSS_RULES);
    });

    it("OVERRIDE RULE: it should replace existing css rules with the given rule", async ({
      expect,
    }) => {
      const RULE_OVERRIDE: RuleSetRule = {
        test: CSS_FILE_REGEX,
        use: ["custom-loader", { loader: "css-loader", options: {} }],
      };

      const config = createTestWebpackConfig("override");

      patchOrAddCssRule(config, {
        cssBuildRule: RULE_OVERRIDE,
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).toContain(RULE_OVERRIDE);
    });
  });
});
