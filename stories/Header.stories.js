import { Header } from "./Header";

export default {
  title: "Example/Header",
  component: Header,
};

export const LoggedIn = {
  args: {
    user: {},
  },
};

export const LoggedOut = { args: {} };
