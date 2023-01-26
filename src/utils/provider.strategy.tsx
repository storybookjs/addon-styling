import React from "react";
import {
  DecoratorFunction,
  useEffect,
  useMemo,
  useParameter,
} from "@storybook/addons";
import { ADDON_ID, PARAM_KEY } from "src/constants";
import { useAddonState } from "@storybook/api";
import { DEFAULT_ADDON_STATE } from "./constants";

export interface ProviderStrategy {
  strategy: "provider";
  themes: { name: string; config: Record<string, any> }[];
  provider: any;
  themeOverride?: string;
}

const withTheme: DecoratorFunction = (storyFn) => {
  const [{ selectedThemeName, themeMap }, setAddonState] = useAddonState(
    ADDON_ID,
    DEFAULT_ADDON_STATE
  );

  const {
    themes,
    provider: Provider,
    themeOverride,
  } = useParameter<ProviderStrategy>(PARAM_KEY);

  useEffect(() => {
    // SET DEFAULT STATE OF ADDON
    setAddonState({
      selectedThemeName: themes[0].name,
      hasMultipleThemes: themes.length > 1,
      themeMap: themes.reduce(
        (map, { name, config }) => ({
          ...map,
          [name]: config,
        }),
        {}
      ),
    });
  }, []);

  const theme = useMemo(() => {
    const key = themeOverride || selectedThemeName;

    return themeMap[key];
  }, [themeOverride, selectedThemeName, themeMap]);

  return <Provider theme={theme}>{storyFn()}</Provider>;
};

export const providerStrategy = {
  decorator: withTheme,
};
