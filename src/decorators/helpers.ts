import addons, { StoryContext, useParameter } from "@storybook/addons";
import { GLOBAL_KEY, PARAM_KEY, THEMING_EVENTS } from "../constants";
import { DEFAULT_THEME_PARAMETERS, ThemeParameters } from "./constants";

/**
 *
 * @param StoryContext
 * @returns The global theme name set for your stories
 */
export function pluckThemeFromContext({ globals }: StoryContext): string {
  return globals[GLOBAL_KEY] || "";
}

export function useThemeParameters(): ThemeParameters {
  return useParameter<ThemeParameters>(PARAM_KEY, DEFAULT_THEME_PARAMETERS);
}

export function initializeThemeState(
  themeNames: string[],
  defaultTheme: string
) {
  addons.getChannel().emit(THEMING_EVENTS.REGISTER_THEMES, {
    defaultTheme,
    themes: themeNames,
  });
}
