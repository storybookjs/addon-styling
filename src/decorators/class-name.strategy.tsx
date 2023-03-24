import { useEffect } from "@storybook/preview-api";
import type { DecoratorFunction } from "@storybook/types";
import {
  initializeThemeState,
  pluckThemeFromContext,
  useThemeParameters,
} from "./helpers";

export interface ClassNameStrategyConfiguration {
  themes: Record<string, string>;
  defaultTheme: string;
  parentSelector?: string;
}

const DEFAULT_ELEMENT_SELECTOR = "html";

export const withThemeByClassName = ({
  themes,
  defaultTheme,
  parentSelector = DEFAULT_ELEMENT_SELECTOR,
}: ClassNameStrategyConfiguration): DecoratorFunction => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  return (storyFn, context) => {
    const { themeOverride } = useThemeParameters();
    const selected = pluckThemeFromContext(context);

    useEffect(() => {
      const selectedThemeName = themeOverride || selected || defaultTheme;
      const parentElement = document.querySelector(parentSelector);

      Object.entries(themes).forEach(([themeName, className]) => {
        if (!className) {
          return;
        }
        if (themeName === selectedThemeName) {
          parentElement.classList.add(className);
        } else {
          parentElement.classList.remove(className);
        }
      });
    }, [themeOverride, selected, parentSelector]);

    return storyFn();
  };
};
