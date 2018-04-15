const {jest: jestConfig} = require('kcd-scripts/config')

module.exports = Object.assign(jestConfig, {
  testMatch: ['**/__tests__/**/*.test.js?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/src/resource',
    '<rootDir>/src/entities/__tests__/middleware.test.js',
  ],
})
