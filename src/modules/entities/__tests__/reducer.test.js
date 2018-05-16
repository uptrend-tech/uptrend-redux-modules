import cases from 'jest-in-case'
import createReducer from '../reducer'
import createSelectors from '../selectors'
import {ENTITIES_RECEIVE, ENTITIES_REMOVE} from '../actions'

const {initialState} = createSelectors({storeName: 'resource'})
const reducer = createReducer({initialState})

const altState = {
  ...initialState,
  foo: {
    id: 1,
    bars: [1, 2, 3],
  },
}

test('returns the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState)
})

test('handles recieving entities', () => {
  const createAction = payload => ({
    type: ENTITIES_RECEIVE,
    payload,
  })
  expect(reducer(initialState, createAction({foo: altState.foo}))).toEqual(
    altState,
  )
  expect(reducer(altState, createAction({foo: {bars: [4]}}))).toEqual({
    ...altState,
    foo: {
      ...altState.foo,
      bars: [4],
    },
  })
})

const actionGen = (entityType, entityIds) => ({
  type: ENTITIES_REMOVE,
  payload: {
    entityIds,
    entityType,
  },
})

cases(
  'handles invalid action payloads',
  opts => {
    expect(() => {
      reducer({dogs: {1: {name: 'Bash'}}}, opts.action)
    }).not.toThrow()
  },
  {
    'entityId = null': {action: actionGen('dogs', null)},
    'entityId =    0': {action: actionGen('dogs', 0)},
    'entityId =   {}': {action: actionGen('dogs', {})},
    'entityId = "sd"': {action: actionGen('dogs', 'sd')},
    'entityId =    2': {action: actionGen('dogs', 2)},
  },
)

cases(
  'handles removing entities',
  opts => {
    expect(reducer(opts.state, opts.action)).toEqual(opts.result)
  },
  {
    'removes 1 entity': {
      action: actionGen('dogs', [1]),
      state: {
        dogs: {
          1: {name: 'Bash'},
          2: {name: 'Spot'},
        },
      },
      result: {
        dogs: {
          2: {name: 'Spot'},
        },
      },
    },
    'removes multiple entities': {
      action: actionGen('dogs', [1, 2, 3]),
      state: {
        dogs: {
          1: {name: 'Bash'},
          2: {name: 'Spot'},
          3: {name: 'Otis'},
          4: {name: 'Mack'},
        },
      },
      result: {
        dogs: {
          4: {name: 'Mack'},
        },
      },
    },
    'removes multiple entities w/ non-existant ids': {
      action: actionGen('dogs', [1, 3, 8, 10]),
      state: {
        dogs: {
          1: {name: 'Bash'},
          2: {name: 'Spot'},
          3: {name: 'Otis'},
          4: {name: 'Mack'},
        },
      },
      result: {
        dogs: {
          2: {name: 'Spot'},
          4: {name: 'Mack'},
        },
      },
    },
    'removes no entities w/ ONLY non-existant ids': {
      action: actionGen('dogs', [8, 10]),
      state: {
        dogs: {
          1: {name: 'Bash'},
          2: {name: 'Spot'},
          3: {name: 'Otis'},
          4: {name: 'Mack'},
        },
      },
      result: {
        dogs: {
          1: {name: 'Bash'},
          2: {name: 'Spot'},
          3: {name: 'Otis'},
          4: {name: 'Mack'},
        },
      },
    },
  },
)
