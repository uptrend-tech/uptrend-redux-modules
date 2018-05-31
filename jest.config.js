const {jest: jestConfig} = require('uptrend-scripts/config')

module.exports = Object.assign(jestConfig, {
  // collectCoverage: true,
  coverageThreshold: undefined, // TODO get 100% coverage and REMOVE this
  testMatch: ['**/__tests__/**/*.test.+(js|jsx|ts|tsx)'],
})
