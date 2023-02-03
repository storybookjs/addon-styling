export const ADDON_ID = "storybook/addon-theming" as const;
export const THEME_SWITCHER_ID = `${ADDON_ID}/theme-switcher` as const;
export const PARAM_KEY = "theming" as const;
export const GLOBAL_KEY = "theme" as const;

export const THEMING_EVENTS = {
  REGISTER_THEMES: `${THEME_SWITCHER_ID}/REGISTER_THEMES`,
} as const;
