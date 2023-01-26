import { string } from "prop-types";

export interface ThemeAddonState {
  selectedThemeName: string;
  hasMultipleThemes: boolean;
  themeMap: Record<string, any>;
}

export const DEFAULT_ADDON_STATE: ThemeAddonState = {
  selectedThemeName: "default",
  hasMultipleThemes: false,
  themeMap: {},
};
