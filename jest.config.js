const {jest: jestConfig} = require('kcd-scripts/config')

module.exports = Object.assign(jestConfig, {
  collectCoverage: true,
  coverageThreshold: undefined,
})
