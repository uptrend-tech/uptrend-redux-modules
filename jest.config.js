const jestConfig = require('uptrend-scripts/config').jest
const babelHelpersList = require('@babel/helpers').list

module.exports = Object.assign(jestConfig, {
  // roots: ['.'],
  // testEnvironment: 'jsdom',
  coverageThreshold: undefined, // TODO get 100% coverage and REMOVE this
  moduleNameMapper: babelHelpersList.reduce((aliasMap, helper) => {
    aliasMap[
      `@babel/runtime/helpers/esm/${helper}`
    ] = `@babel/runtime/helpers/${helper}`
    return aliasMap
  }, {}),
})
