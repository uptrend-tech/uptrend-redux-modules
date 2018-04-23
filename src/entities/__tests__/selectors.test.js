import cases from 'jest-in-case'
import selectorsFactory from '../selectors'
import {getSchemas, getEntitiesState} from '../../utils/test/fixtures'

const selectors = selectorsFactory({
  schemas: getSchemas(),
})

const getState = () => ({
  entities: getEntitiesState(),
})

let state = getState()

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
    [{state: {}, entity: 'team'}, {state, entity: 'no-match-entity'}],
  )

  cases(
    'returns entity',
    opts => {
      const entity = opts.state.entities[opts.entity]
      expect(selectors.getEntity(opts.state, opts.entity)).toBe(entity)
    },
    [{state, entity: 'team'}, {state, entity: 'user'}],
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
      {state, entity: 'team'},
      {state, entity: 'team', id: null},
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
      {state: {}, entity: 'team', id: 1},
      {state: {}, entity: 'team', id: '2'},
      {state, entity: 'team', id: 99999},
      {state, entity: 'user', id: 'miss'},
    ],
  )

  cases(
    'returns entityItem',
    opts => {
      const entityItem = opts.state.entities[opts.entity][opts.id]
      expect(selectors.getEntityItem(opts.state, opts.entity, opts.id)).toBe(
        entityItem,
      )
    },
    [
      {state, entity: 'team', id: 1},
      {state, entity: 'team', id: 'aaa-bbb'},
      {state, entity: 'user', id: 1},
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
      {state, entity: 'team'},
      {state, entity: 'team', ids: null},
      {state, entity: 'team', ids: 1},
      {state, entity: 'team', ids: 'aaa-bbb'},
      {state, entity: 'team', ids: {}},
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
      {state: {}, entity: 'team', ids: [1]},
      {state: {}, entity: 'team', ids: ['2']},
      {state, entity: 'team', ids: [99999]},
      {state, entity: 'user', ids: [99999, 'miss']},
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
      {state, entity: 'team', ids: [1], result: [state.entities.team[1]]},
      {
        state,
        entity: 'team',
        ids: [1, 2],
        result: [state.entities.team[1], state.entities.team[2]],
      },
      {
        state,
        entity: 'user',
        ids: ['aaa', 'ccc'],
        result: [state.entities.user.aaa, state.entities.user.ccc],
      },
    ],
  )
})
