export interface ThemeAddonState {
  themesList: string[];
  themeDefault?: string;
}

export const DEFAULT_ADDON_STATE: ThemeAddonState = {
  themesList: [],
  themeDefault: undefined,
};

export interface ThemeParameters {
  themeOverride?: string;
}

export const DEFAULT_THEME_PARAMETERS: ThemeParameters = {};
