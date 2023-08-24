const { webpackFinal, viteFinal } = require("./dist/preset");
const preview = require("./dist/preview");
const manager = require("./dist/manager");

module.exports = {
  webpackFinal,
  viteFinal,
  previewAnnotations: [preview],
  managerEntries: [manager],
};
