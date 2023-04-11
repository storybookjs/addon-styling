import type { Renderer, ProjectAnnotations } from "@storybook/types";
import { GLOBAL_KEY } from "./constants";

const preview: ProjectAnnotations<Renderer> = {
  globals: {
    // Required to make sure SB picks this up from URL params
    [GLOBAL_KEY]: "",
  },
};

export default preview;
