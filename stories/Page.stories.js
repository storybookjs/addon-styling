import { Page } from "./Page";
import * as HeaderStories from "./Header.stories";

export default {
  title: "Example/Page",
  component: Page,
};

export const LoggedIn = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};

export const LoggedOut = {
  args: {
    ...HeaderStories.LoggedOut.args,
  },
};
