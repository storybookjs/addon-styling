import { useEffect } from "@storybook/preview-api";
import type { DecoratorFunction, Renderer } from "@storybook/types";
import {
  initializeThemeState,
  pluckThemeFromContext,
  useThemeParameters,
} from "./helpers";

export interface DataAttributeStrategyConfiguration {
  themes: Record<string, string>;
  defaultTheme: string;
  parentSelector?: string;
  attributeName?: string;
}

const DEFAULT_ELEMENT_SELECTOR = "html";
const DEFAULT_DATA_ATTRIBUTE = "data-theme";

export const withThemeByDataAttribute = <
  TRenderer extends Renderer = Renderer
>({
  themes,
  defaultTheme,
  parentSelector = DEFAULT_ELEMENT_SELECTOR,
  attributeName = DEFAULT_DATA_ATTRIBUTE,
}: DataAttributeStrategyConfiguration): DecoratorFunction<TRenderer> => {
  initializeThemeState(Object.keys(themes), defaultTheme);
  return (storyFn, context) => {
    const { themeOverride } = useThemeParameters();
    const selected = pluckThemeFromContext(context);

    useEffect(() => {
      const parentElement = document.querySelector(parentSelector);
      const themeKey = themeOverride || selected || defaultTheme;

      parentElement.setAttribute(attributeName, themes[themeKey]);
    }, [themeOverride, selected, parentSelector, attributeName]);

    return storyFn();
  };
};
