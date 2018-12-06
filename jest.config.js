const jestConfig = require('uptrend-scripts/config').jest
const babelHelpersList = require('@babel/helpers').list

module.exports = Object.assign(jestConfig, {
  coverageThreshold: {
    // TODO get 100% coverage across all and REMOVE this
    global: {
      branches: 85,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  roots: ['.'],
  testEnvironment: 'jsdom',
  moduleNameMapper: babelHelpersList.reduce((aliasMap, helper) => {
    aliasMap[
      `@babel/runtime/helpers/esm/${helper}`
    ] = `@babel/runtime/helpers/${helper}`
    return aliasMap
  }, {}),
})
