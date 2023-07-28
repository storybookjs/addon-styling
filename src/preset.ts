import { webpackFinal as webpack } from "./webpack/webpackFinal";
import { viteFinal as vite } from "./vite/viteFinal";

export const webpackFinal = webpack as any;

export const viteFinal = vite as any;

export const previewAnnotations = [
  require.resolve("@storybook/addon-styling/preview"),
];

export const managerEntries = [
  require.resolve("@storybook/addon-styling/manager"),
];
