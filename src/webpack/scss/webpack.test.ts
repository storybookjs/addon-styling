import { describe, it } from "vitest";
import {
  isRuleForSCSS,
  buildStyleLoader,
  buildCssModuleRules,
  buildCssLoader,
  buildPostCssLoader,
  buildUrlResolverLoader,
  buildSassLoader,
  patchOrAddScssRule,
  SCSS_FILE_REGEX,
} from "./webpack";

import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";

describe("WEBPACK/SCSS: configuration builders for scss files", () => {
  describe("UTILITY: isRuleForSCSS", () => {
    it("TRUE: it should return true when given a webpack rule for scss files", async ({
      expect,
    }) => {
      const webpackRule: RuleSetRule = {
        test: /\.scss$/i,
        use: [],
      };
      const result = isRuleForSCSS(webpackRule);

      expect(result).toBeTruthy();
    });

    it("FALSE: it should return false when given a webpack rule for other file types", async ({
      expect,
    }) => {
      const someWebpackRule: RuleSetRule = {
        test: /\.svg$/i,
        use: [],
      };
      const someResult = isRuleForSCSS(someWebpackRule);

      const otherWebpackRule: RuleSetRule = {
        test: /\.svg$/i,
        use: [],
      };
      const otherResult = isRuleForSCSS(otherWebpackRule);

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
        options: { importLoaders: 3 },
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
        options: { modules: { auto: true }, importLoaders: 3 },
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

  describe("UTILITY: buildUrlResolverLoader", () => {
    it("LOADER: it should return a resolve-url-loader object", async ({
      expect,
    }) => {
      const result = buildUrlResolverLoader({});

      expect(result).toHaveProperty("loader");
      expect(result.loader).toEqual(require.resolve("resolve-url-loader"));
    });
  });

  describe("UTILITY: buildSassLoader", () => {
    it("LOADER: it should return a sass-loader object", ({ expect }) => {
      const result = buildSassLoader({
        sass: { implementation: 'require.resolve("sass")' },
      });

      expect(result).toHaveProperty("loader");
      expect(result.loader).toEqual(require.resolve("sass-loader"));
    });
  });

  describe("UTILITY: patchOrAddScssRule", () => {
    const EXISTING_SCSS_RULES = {
      test: SCSS_FILE_REGEX,
      use: ["style-loader", "css-loader"],
    };

    const createTestWebpackConfig = (id: string): WebpackConfig => ({
      name: `testConfig-${id}`,
      module: {
        rules: [EXISTING_SCSS_RULES],
      },
    });

    it("NO CONFIGURATION: it should leave existing scss rules alone if no configuration is given", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("default");

      patchOrAddScssRule(config, {});

      expect(config.module.rules).toContainEqual(EXISTING_SCSS_RULES);
    });

    it("ENABLE POSTCSS: it should replace existing scss rules to enable postcss", async ({
      expect,
    }) => {
      const config = createTestWebpackConfig("postcss");

      patchOrAddScssRule(config, {
        postCss: { implementation: 'require.resolve("postcss")' },
        sass: { implementation: 'require.resolve("sass")' },
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_SCSS_RULES);
      expect(config.module.rules[0]?.use).toMatchInlineSnapshot(`
        [
          {
            "loader": "path/to/project/node_modules/.pnpm/style-loader@3.3.2_webpack@5.77.0/node_modules/style-loader/dist/cjs.js",
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/css-loader@6.7.3_webpack@5.77.0/node_modules/css-loader/dist/cjs.js",
            "options": {
              "importLoaders": 3,
            },
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/postcss-loader@7.2.4_@types+node@16.18.16_postcss@8.4.23_ts-node@10.9.1_typescript@4.9.5_webpack@5.77.0/node_modules/postcss-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"postcss\\")",
            },
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/resolve-url-loader@5.0.0/node_modules/resolve-url-loader/index.js",
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/sass-loader@13.2.2_webpack@5.77.0/node_modules/sass-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"sass\\")",
              "sassOptions": {
                "implementation": "require.resolve(\\"sass\\")",
              },
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

      patchOrAddScssRule(config, {
        cssModules: true,
        sass: { implementation: 'require.resolve("sass")' },
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_SCSS_RULES);
      expect(config.module.rules[0]?.use).toMatchInlineSnapshot(`
        [
          {
            "loader": "path/to/project/node_modules/.pnpm/style-loader@3.3.2_webpack@5.77.0/node_modules/style-loader/dist/cjs.js",
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/css-loader@6.7.3_webpack@5.77.0/node_modules/css-loader/dist/cjs.js",
            "options": {
              "importLoaders": 2,
              "modules": {
                "auto": true,
              },
            },
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/resolve-url-loader@5.0.0/node_modules/resolve-url-loader/index.js",
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/sass-loader@13.2.2_webpack@5.77.0/node_modules/sass-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"sass\\")",
              "sassOptions": {
                "implementation": "require.resolve(\\"sass\\")",
              },
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

      patchOrAddScssRule(config, {
        postCss: { implementation: 'require.resolve("postcss")' },
        sass: { implementation: 'require.resolve("sass")' },
        cssModules: { auto: true, namedExport: true },
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).not.toContain(EXISTING_SCSS_RULES);
      expect(config.module.rules[0]?.sideEffects).toBeTruthy();
      expect(config.module.rules[0]?.use).toMatchInlineSnapshot(`
        [
          {
            "loader": "path/to/project/node_modules/.pnpm/style-loader@3.3.2_webpack@5.77.0/node_modules/style-loader/dist/cjs.js",
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/css-loader@6.7.3_webpack@5.77.0/node_modules/css-loader/dist/cjs.js",
            "options": {
              "importLoaders": 3,
              "modules": {
                "auto": true,
                "namedExport": true,
              },
            },
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/postcss-loader@7.2.4_@types+node@16.18.16_postcss@8.4.23_ts-node@10.9.1_typescript@4.9.5_webpack@5.77.0/node_modules/postcss-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"postcss\\")",
            },
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/resolve-url-loader@5.0.0/node_modules/resolve-url-loader/index.js",
          },
          {
            "loader": "path/to/project/node_modules/.pnpm/sass-loader@13.2.2_webpack@5.77.0/node_modules/sass-loader/dist/cjs.js",
            "options": {
              "implementation": "require.resolve(\\"sass\\")",
              "sassOptions": {
                "implementation": "require.resolve(\\"sass\\")",
              },
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
        test: SCSS_FILE_REGEX,
        use: ["custom-loader", { loader: "css-loader", options: {} }],
      };

      const config = createTestWebpackConfig("override");

      patchOrAddScssRule(config, {
        scssBuildRule: RULE_OVERRIDE,
      });

      expect(config.module.rules.length).toEqual(1);
      expect(config.module.rules).toContain(RULE_OVERRIDE);
    });
  });
});
