const {jest: jestConfig} = require('kcd-scripts/config')

module.exports = Object.assign(jestConfig, {
  // TODO remove these
  testPathIgnorePatterns: [
    '<rootDir>/src/resource',
    // '<rootDir>/src/entities/__tests__/middleware.test.js',
  ],
  coverageThreshold: undefined,
})
