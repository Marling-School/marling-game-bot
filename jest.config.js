// jest.config.js
const { defaults } = require("jest-config");
module.exports = {
  // ...
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  // ...
};
