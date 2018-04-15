import cases from 'jest-in-case'
// import t from 'tcomb';
// import * as k from 'kitimat-jest';
import selectorsFactory from '../selectors'
import {/* getSchemas, */ getState} from './fixtures'

const selectors = selectorsFactory({
  /* schemas: getSchemas() */
})

let state = getState()

beforeEach(() => {
  state = getState()
})

test('initialState', () => {
  expect(selectors.initialState).toEqual({})
})

describe('getEntity', () => {
  beforeEach(() => {
    state = getState()
  })

  cases(
    'throws on bad arguments',
    opts => {
      expect(() => selectors.getEntity(opts.state, opts.entity)).toThrow()
    },
    [
      {state},
      {state, entity: null},
      {state, entity: false},
      {state, entity: 1},
      {state, entity: []},
    ],
  )

  cases(
    'empty object returned for non-existing entity',
    opts => {
      expect(selectors.getEntity(opts.state, opts.entity)).toEqual({})
    },
    [{state: {}, entity: 'test'}, {state, entity: 'no-match-entity'}],
  )

  cases(
    'returns entity',
    opts => {
      const entity = opts.state[opts.entity]
      expect(selectors.getEntity(opts.state, opts.entity)).toBe(entity)
    },
    [{state, entity: 'test'}, {state, entity: 'trial'}],
  )
})

describe('getEntityItem', () => {
  beforeEach(() => {
    state = getState()
  })

  cases(
    'throws on bad arguments',
    opts => {
      expect(() =>
        selectors.getEntityItem(opts.state, opts.entity, opts.id),
      ).toThrow()
    },
    [
      {state},
      {state, entity: 'test'},
      {state, entity: 'test', id: null},
      {state, entity: [], id: null},
    ],
  )

  cases(
    'returns undefined',
    opts => {
      expect(
        selectors.getEntityItem(opts.state, opts.entity, opts.id),
      ).toBeUndefined()
    },
    [
      {state: {}, entity: 'test', id: 1},
      {state: {}, entity: 'test', id: '2'},
      {state, entity: 'test', id: 99999},
      {state, entity: 'trial', id: 'miss'},
    ],
  )

  cases(
    'returns entityItem',
    opts => {
      const entityItem = opts.state[opts.entity][opts.id]
      expect(selectors.getEntityItem(opts.state, opts.entity, opts.id)).toBe(
        entityItem,
      )
    },
    [
      {state, entity: 'test', id: 1},
      {state, entity: 'test', id: 'aaa-bbb'},
      {state, entity: 'trial', id: 1},
    ],
  )
})

describe('getEntityItemList', () => {
  beforeEach(() => {
    state = getState()
  })

  cases(
    'throws on bad arguments',
    opts => {
      expect(() =>
        selectors.getEntityItemList(opts.state, opts.entity, opts.ids),
      ).toThrow()
    },
    [
      {state},
      {state, entity: null},
      {state, entity: 1, ids: 1},
      {state, entity: [], ids: 1},
      {state, entity: {}, ids: 1},
      {state, entity: 'test'},
      {state, entity: 'test', ids: null},
      {state, entity: 'test', ids: 1},
      {state, entity: 'test', ids: 'aaa-bbb'},
      {state, entity: 'test', ids: {}},
    ],
  )

  cases(
    'returns no results as empty list',
    opts => {
      expect(
        selectors.getEntityItemList(opts.state, opts.entity, opts.ids),
      ).toEqual([])
    },
    [
      {state: {}, entity: 'test', ids: [1]},
      {state: {}, entity: 'test', ids: ['2']},
      {state, entity: 'test', ids: [99999]},
      {state, entity: 'trial', ids: [99999, 'miss']},
    ],
  )

  cases(
    'returns entityItemList',
    opts => {
      const result = selectors.getEntityItemList(
        opts.state,
        opts.entity,
        opts.ids,
      )
      expect(result).toEqual(opts.result)
    },
    [
      {state, entity: 'test', ids: [1], result: [state.test[1]]},
      {
        state,
        entity: 'test',
        ids: [1, 2],
        result: [state.test[1], state.test[2]],
      },
      {
        state,
        entity: 'test',
        ids: [1, 'aaa-bbb'],
        result: [state.test[1], state.test['aaa-bbb']],
      },
      {state, entity: 'trial', ids: [1], result: [state.trial[1]]},
    ],
  )
})
