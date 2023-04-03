import { addons, types } from "@storybook/manager-api";

import { ADDON_ID, PARAM_KEY, THEME_SWITCHER_ID } from "./constants";

import { ThemeSwitcher } from "./components/theme-switcher";

// Register the addon
addons.register(ADDON_ID, (api) => {
  // Register the theme switcher
  addons.add(THEME_SWITCHER_ID, {
    type: types.TOOL,
    title: `Theme`,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: ThemeSwitcher,
    paramKey: PARAM_KEY,
  });
});
