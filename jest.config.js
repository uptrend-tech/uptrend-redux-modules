const {jest: jestConfig} = require('uptrend-scripts/config')

module.exports = Object.assign(jestConfig, {
  // collectCoverage: true,
  coverageThreshold: undefined,
})
