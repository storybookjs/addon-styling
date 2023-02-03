import React from "react";
import { DecoratorFunction, useMemo } from "@storybook/addons";

import {
  initializeThemeState,
  pluckThemeFromContext,
  useThemeParameters,
} from "./helpers";

type Theme = Record<string, any>;
type ThemeMap = Record<string, Theme>;

export interface ProviderStrategyConfiguration {
  Provider: any;
  GlobalStyles?: any;
  defaultTheme?: string;
  themes: ThemeMap;
}

const pluckThemeFromKeyPairTuple = ([_, themeConfig]: [string, Theme]): Theme =>
  themeConfig;

export const withThemeFromJSXProvider = ({
  Provider,
  GlobalStyles,
  defaultTheme,
  themes,
}: ProviderStrategyConfiguration): DecoratorFunction => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  return (storyFn, context) => {
    const { themeOverride } = useThemeParameters();
    const selected = pluckThemeFromContext(context);

    const theme = useMemo(() => {
      const selectedThemeName = themeOverride || selected || defaultTheme;
      const pairs = Object.entries(themes);

      return pairs.length === 1
        ? pluckThemeFromKeyPairTuple(pairs[0])
        : themes[selectedThemeName];
    }, [themes, selected, themeOverride]);

    return (
      <Provider theme={theme}>
        {GlobalStyles && <GlobalStyles />}
        {storyFn()}
      </Provider>
    );
  };
};
