import React, { Fragment, useMemo } from "react";
import {
  useAddonState,
  useChannel,
  useGlobals,
  useParameter,
} from "@storybook/api";
import { styled } from "@storybook/theming";
import {
  Icons,
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from "@storybook/components";

import {
  PARAM_KEY,
  THEME_SWITCHER_ID,
  THEMING_EVENTS,
  DEFAULT_ADDON_STATE,
  DEFAULT_THEME_PARAMETERS,
  ThemeAddonState,
  ThemeParameters,
} from "../constants";

const IconButtonLabel = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: 10,
}));

export const ThemeSwitcher = () => {
  const { themeOverride } = useParameter<ThemeParameters>(
    PARAM_KEY,
    DEFAULT_THEME_PARAMETERS
  );
  const [{ theme: selected }, updateGlobals] = useGlobals();

  const [{ themesList, themeDefault }, updateState] =
    useAddonState<ThemeAddonState>(THEME_SWITCHER_ID, DEFAULT_ADDON_STATE);

  useChannel({
    [THEMING_EVENTS.REGISTER_THEMES]: ({ themes, defaultTheme }) => {
      updateState((state) => ({
        ...state,
        themesList: themes,
        themeDefault: defaultTheme,
      }));
    },
  });

  const label = useMemo(() => {
    if (themeOverride) {
      return `Story override`;
    }

    const themeName = selected || themeDefault;

    return themeName && `${themeName} theme`;
  }, [themeOverride, themeDefault, selected]);

  return (
    <Fragment>
      <WithTooltip
        placement="top"
        trigger="click"
        closeOnClick
        tooltip={({ onHide }) => {
          return (
            <TooltipLinkList
              links={themesList.map((theme) => ({
                id: theme,
                title: theme,
                active: selected === theme,
                onClick: () => {
                  updateGlobals({ theme });
                  onHide();
                },
              }))}
            />
          );
        }}
      >
        <IconButton
          key={THEME_SWITCHER_ID}
          active={themesList.length > 1 && !themeOverride}
          title="Theme"
        >
          <Icons icon="paintbrush" />
          {label && <IconButtonLabel>{label}</IconButtonLabel>}
        </IconButton>
      </WithTooltip>
    </Fragment>
  );
};
