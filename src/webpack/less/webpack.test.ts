import { describe, it } from "vitest";
import {
  isRuleForLESS,
  buildStyleLoader,
  buildCssModuleRules,
  buildCssLoader,
  buildPostCssLoader,
  buildLessLoader,
  patchOrAddLessRule,
  LESS_FILE_REGEX,
} from "./webpack";

import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";

describe("WEBPACK/LESS: configuration builders for less files", () => {
  describe("UTILITY: isRuleForLESS", () => {
    it("TRUE: it should return true when given a webpack rule for less files", async ({
      expect,
    }) => {
      const webpackRule: RuleSetRule = {
        test: /\.less$/i,
        use: [],
      };
      const result = isRuleForLESS(webpackRule);

      expect(result).toBeTruthy();
    });

    it("FALSE: it should return false when given a webpack rule for other file types", async ({
      expect,
    }) => {
      const someWebpackRule: RuleSetRule = {
        test: /\.svg$/i,
        use: [],
      };
      const someResult = isRuleForLESS(someWebpackRule);

      const otherWebpackRule: RuleSetRule = {
        test: /\.svg$/i,
        use: [],
      };
      const otherResult = isRuleForLESS(otherWebpackRule);

      expect(someResult).toBeFalsy();
      expect(otherResult).toBeFalsy();
    });
  });

  describe("UTILITY: buildStyleLoader", () => {
    it("LOADER: it should return a style-loader object", async ({ expect }) => {
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
        options: { importLoaders: 2 },
      };

      const result = buildCssLoader({
        postCss: { implementation: 'require.resolve("postcss")' },
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
        options: { modules: { auto: true }, importLoaders: 2 },
      };

      const result = buildCssLoader({
        cssModules: true,
        postCss: { implementation: 'require.resolve("postcss")' },
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
        postCss: { implementation: 'require.resolve("postcss")' },
      });

      expect(result).toHaveProperty("loader");
      expect(result.loader).toEqual(require.resolve("postcss-loader"));
    });
  });

  describe("UTILITY: buildLessLoader", () => {
    it("LOADER: it should return a sass-loader object", ({ expect }) => {
      const result = buildLessLoader({
        sass: { implementation: 'require.resolve("less")' },
      });

      expect(result).toHaveProperty("loader");
      expect(result.loader).toEqual(require.resolve("less-loader"));
    });
  });

  describe("UTILITY: patchOrAddLessRule", () => {
    const EXISTING_LESS_RULES = {
      test: LESS_FILE_REGEX,
      use: ["style-loader", "css-loader"],
    };

    const createTestWebpackConfig = (id: string): WebpackConfig => ({
      name: `testConfig-${id}`,
      module: {
        rules: [EXISTING_LESS_RULES],
      },
    });

    it("NO CONFIGURATION: it should leave existing scss rules alone if no configuration is given", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("default");

      patchOrAddLessRule(config, {});

      expect(config.module.rules).toContainEqual(EXISTING_LESS_RULES);
    });

    it("ENABLE POSTCSS: it should replace existing scss rules to enable postcss", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("postcss");

      patchOrAddLessRule(config, {
        postCss: { implementation: 'require.resolve("postcss")' },
        less: { implementation: 'require.resolve("less")' },
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_LESS_RULES);
      expect(config.module.rules[0]?.use).toMatchInlineSnapshot(`
        [
          {
            "loader": "path/to/project/node_modules/style-loader/dist/cjs.js",
          },
          {
            "loader": "path/to/project/node_modules/css-loader/dist/cjs.js",
            "options": {
              "importLoaders": 2,
            },
          },
          {
            "loader": "path/to/project/node_modules/postcss-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"postcss\\")",
            },
          },
          {
            "loader": "path/to/project/node_modules/less-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"less\\")",
              "sourceMap": true,
            },
          },
        ]
      `);
    });

    it("ENABLE CSS MODULES: it should replace existing scss rules to enable css modules", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("postcss");

      patchOrAddLessRule(config, {
        cssModules: true,
        less: { implementation: 'require.resolve("less")' },
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_LESS_RULES);
      expect(config.module.rules[0]?.use).toMatchInlineSnapshot(`
        [
          {
            "loader": "path/to/project/node_modules/style-loader/dist/cjs.js",
          },
          {
            "loader": "path/to/project/node_modules/css-loader/dist/cjs.js",
            "options": {
              "importLoaders": 1,
              "modules": {
                "auto": true,
              },
            },
          },
          {
            "loader": "path/to/project/node_modules/less-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"less\\")",
              "sourceMap": true,
            },
          },
        ]
      `);
    });

    it("ENABLE POSTCSS & CSS MODULES: it should replace existing scss rules to enable postcss & css modules", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("complex");

      patchOrAddLessRule(config, {
        postCss: { implementation: 'require.resolve("postcss")' },
        less: { implementation: 'require.resolve("less")' },
        cssModules: { auto: true, namedExport: true },
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_LESS_RULES);
      expect(config.module.rules[0]?.sideEffects).toBeTruthy();
      expect(config.module.rules[0]?.use).toMatchInlineSnapshot(`
        [
          {
            "loader": "path/to/project/node_modules/style-loader/dist/cjs.js",
          },
          {
            "loader": "path/to/project/node_modules/css-loader/dist/cjs.js",
            "options": {
              "importLoaders": 2,
              "modules": {
                "auto": true,
                "namedExport": true,
              },
            },
          },
          {
            "loader": "path/to/project/node_modules/postcss-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"postcss\\")",
            },
          },
          {
            "loader": "path/to/project/node_modules/less-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"less\\")",
              "sourceMap": true,
            },
          },
        ]
      `);
    });

    it("OVERRIDE RULE: it should replace existing scss rules with the given rule", async ({
      expect,
    }) => {
      const RULE_OVERRIDE: RuleSetRule = {
        test: LESS_FILE_REGEX,
        use: ["custom-loader", { loader: "css-loader", options: {} }],
      };

      const config = createTestWebpackConfig("override");

      patchOrAddLessRule(config, {
        lessBuildRule: RULE_OVERRIDE,
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).toContain(RULE_OVERRIDE);
    });
  });
});
