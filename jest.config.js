const {jest: jestConfig} = require('uptrend-scripts/config')

module.exports = Object.assign(jestConfig, {
  coverageThreshold: undefined, // TODO get 100% coverage and REMOVE this
})
