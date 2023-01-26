import { DecoratorFunction, useEffect, useParameter } from "@storybook/addons";
import { ADDON_ID, PARAM_KEY } from "src/constants";
import { useAddonState } from "@storybook/api";
import { DEFAULT_ADDON_STATE } from "./constants";

export interface DataAttributeStrategy {
  strategy: "dataAttribute";
  themes?: Record<string, string>;
  defaultTheme: string;
  parentSelector?: string;
  attributeName?: string;
  themeOverride?: string;
}

const DEFAULT_ELEMENT_SELECTOR = "html";

const withThemeByDataAttribute: DecoratorFunction = (storyFn) => {
  const [{ selectedThemeName }, setAddonState] = useAddonState(
    ADDON_ID,
    DEFAULT_ADDON_STATE
  );

  const {
    themes,
    defaultTheme,
    parentSelector = DEFAULT_ELEMENT_SELECTOR,
    attributeName = "data-theme",
    themeOverride,
  } = useParameter<DataAttributeStrategy>(PARAM_KEY);

  useEffect(() => {
    // SET DEFAULT STATE OF ADDON
    setAddonState({
      selectedThemeName: defaultTheme,
      hasMultipleThemes: Object.keys(themes).length > 1,
      themeMap: {},
    });
  }, []);

  useEffect(() => {
    const parentElement = document.querySelector(parentSelector);
    const themeKey = themeOverride || selectedThemeName;

    parentElement.setAttribute(attributeName, themes[themeKey]);
  }, [themeOverride, selectedThemeName, parentSelector, attributeName]);

  return storyFn();
};

export const providerStrategy = {
  decorator: withThemeByDataAttribute,
};
