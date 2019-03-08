import {createCamelKeys, createSnakeKeys} from '../index'

/* eslint-disable camelcase */
/* eslint-disable babel/camelcase */
describe('camelKeys', () => {
  const camelKeys = createCamelKeys()

  test.each`
    source                      | expected
    ${{test_one: 1}}            | ${{testOne: 1}}
    ${{'test-two': 2}}          | ${{'test-two': 2}}
    ${{'a1b2C-three': 3}}       | ${{'a1b2C-three': 3}}
    ${{'a1b2C-Four': 4}}        | ${{'a1b2C-Four': 4}}
    ${{_prefix_one: 'p1'}}      | ${{_prefix_one: 'p1'}}
    ${{__prefixTwo: 'p2'}}      | ${{__prefixTwo: 'p2'}}
    ${{'__prefix-three': 'p3'}} | ${{'__prefix-three': 'p3'}}
  `(
    'returns $expected when camelKeys is passed $source',
    ({source, expected}) => {
      expect(camelKeys(source)).toEqual(expected)
    },
  )
})

describe('camelKeys - prevent matrixValues pred', () => {
  const customPred = (key, obj, isSafe) => {
    // use original key if it's `matrixValues`
    if (key === 'matrix-values') return false

    // key has ! at end inverse typical behavior
    if (key.endsWith('!')) return !isSafe

    // Fall back to default conversion
    return null
  }

  const camelKeys = createCamelKeys(customPred)
  test.each`
    source                       | expected
    ${{'matrix-values': 1}}      | ${{'matrix-values': 1}}
    ${{'invertSafe!': 2}}        | ${{'invertSafe!': 2}}
    ${{'invert-not_safe!': 3}}   | ${{'invertNotSafe!': 3}}
    ${{'a1b2C-Four': 4}}         | ${{'a1b2C-Four': 4}}
    ${{_prefix_one: 'p1'}}       | ${{_prefix_one: 'p1'}}
    ${{__prefixTwo: 'p2'}}       | ${{__prefixTwo: 'p2'}}
    ${{'__prefix-three!': 'p3'}} | ${{'prefixThree!': 'p3'}}
  `(
    'returns $expected when camelKeys is passed $source',
    ({source, expected}) => {
      expect(camelKeys(source)).toEqual(expected)
    },
  )
})

describe('snakeKeys', () => {
  const snakeKeys = createSnakeKeys()
  test.each`
    source                      | expected
    ${{testOne: 1}}             | ${{test_one: 1}}
    ${{'test-two': 2}}          | ${{'test-two': 2}}
    ${{'a1b2C-three': 3}}       | ${{'a1b2C-three': 3}}
    ${{'a1b2C-Four': 4}}        | ${{'a1b2C-Four': 4}}
    ${{_prefix_one: 'p1'}}      | ${{_prefix_one: 'p1'}}
    ${{__prefixTwo: 'p2'}}      | ${{__prefixTwo: 'p2'}}
    ${{'__prefix-three': 'p3'}} | ${{'__prefix-three': 'p3'}}
  `(
    'returns $expected when snakeKeys is passed $source',
    ({source, expected}) => {
      expect(snakeKeys(source)).toEqual(expected)
    },
  )
})

describe('snakeKeys - prevent matrixValues pred', () => {
  const customPred = (key, obj, isSafe) => {
    // use original key if it's `matrixValues`
    if (key === 'matrixValues') return false

    // key has ! at end inverse typical behavior
    if (key.endsWith('!')) return !isSafe

    // Fall back to default conversion
    return null
  }

  const snakeKeys = createSnakeKeys(customPred)
  test.each`
    source                       | expected
    ${{matrixValues: 1}}         | ${{matrixValues: 1}}
    ${{'invertSafe!': 2}}        | ${{'invertSafe!': 2}}
    ${{'invert-notSafe!': 3}}    | ${{'invert-not_safe!': 3}}
    ${{'a1b2C-Four': 4}}         | ${{'a1b2C-Four': 4}}
    ${{_prefix_one: 'p1'}}       | ${{_prefix_one: 'p1'}}
    ${{__prefixTwo: 'p2'}}       | ${{__prefixTwo: 'p2'}}
    ${{'__prefix-three!': 'p3'}} | ${{'__prefix-three!': 'p3'}}
  `(
    'returns $expected when snakeKeys is passed $source',
    ({source, expected}) => {
      expect(snakeKeys(source)).toEqual(expected)
    },
  )
})
