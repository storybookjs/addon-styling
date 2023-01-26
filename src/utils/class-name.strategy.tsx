import { DecoratorFunction, useEffect, useParameter } from "@storybook/addons";
import { ADDON_ID, PARAM_KEY } from "src/constants";
import { useAddonState } from "@storybook/api";
import { DEFAULT_ADDON_STATE } from "./constants";

export interface ClassNameStrategy {
  strategy: "className";
  themes: Record<string, string>;
  defaultTheme: string;
  parentSelector?: string;
  themeOverride?: string;
}

const DEFAULT_ELEMENT_SELECTOR = "html";

const withThemeByClassName: DecoratorFunction = (storyFn) => {
  const [{ selectedThemeName }, setAddonState] = useAddonState(
    ADDON_ID,
    DEFAULT_ADDON_STATE
  );

  const {
    themes,
    defaultTheme,
    parentSelector = DEFAULT_ELEMENT_SELECTOR,
    themeOverride,
  } = useParameter<ClassNameStrategy>(PARAM_KEY);

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

    Object.entries(themes).forEach(([themeName, className]) => {
      if (themeName === selectedThemeName) {
        parentElement.classList.add(className);
      } else {
        parentElement.classList.remove(className);
      }
    });
  }, [themeOverride, selectedThemeName, parentSelector]);

  return storyFn();
};

export const providerStrategy = {
  decorator: withThemeByClassName,
};
