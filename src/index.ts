// @ts-expect-error
if (module && module.hot && module.hot.decline) {
  // @ts-expect-error
  module.hot.decline();
}

// make it work with --isolatedModules
export default {};
export * from "./decorators";
