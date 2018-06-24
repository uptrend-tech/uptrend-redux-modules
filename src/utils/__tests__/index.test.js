import {camelKeys, snakeKeys} from '../index'

/* eslint-disable camelcase */
describe('camelKeys', () => {
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

describe('snakeKeys', () => {
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
/* eslint-enable camelcase */
