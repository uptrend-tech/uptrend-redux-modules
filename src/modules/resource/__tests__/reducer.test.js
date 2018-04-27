import cases from 'jest-in-case'
import * as actions from '../actions'
import {getResourceState, initialState} from '../selectors'
import reducer from '../reducer'

const actionGen = (type, payload, meta) => ({
  type,
  payload,
  meta: {
    resource: 'thing',
    ...meta,
  },
})

const state = resourceState => ({
  ...initialState,
  thing: {
    ...getResourceState(initialState, 'thing'),
    ...resourceState,
  },
})

it('returns the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState)
})

describe('RESOURCE_CREATE_SUCCESS', () => {
  cases(
    'adds new items to list',
    opts => {
      const action = actionGen(actions.RESOURCE_CREATE_SUCCESS, opts.payload)
      expect(reducer(opts.state, action)).toEqual(state(opts.result))
    },
    {
      'initial state & payload w/ only data': {
        payload: {data: {id: 1}},
        state: initialState,
        result: {list: [{id: 1}]},
      },
      'initial state & payload w/ entities': {
        payload: {data: {id: 2}, entities: 2},
        state: initialState,
        result: {list: [2]},
      },
      'existing state & payload w/ only data': {
        payload: {data: {id: 1}},
        state: state({list: [1, 2]}),
        result: {list: [{id: 1}, 1, 2]},
      },
      'existing state & payload w/ entities': {
        payload: {data: {id: 2}, entities: 2},
        state: state({list: [1]}),
        result: {list: [2, 1]},
      },
    },
  )
})

describe('RESOURCE_LIST_READ_SUCCESS', () => {
  cases(
    'sets/overrides list',
    opts => {
      const action = actionGen(actions.RESOURCE_LIST_READ_SUCCESS, opts.payload)
      expect(reducer(opts.state, action)).toEqual(state(opts.result))
    },
    {
      'initial state & payload w/ only data': {
        payload: {data: [{id: 1}, {id: 2}]},
        state: initialState,
        result: {list: [{id: 1}, {id: 2}]},
      },
      'initial state & payload w/ entities': {
        payload: {data: [{id: 1}, {id: 2}], entities: [2, 1]},
        state: initialState,
        result: {list: [2, 1]},
      },
      'existing state & payload w/ only data': {
        payload: {data: [{id: 1}, {id: 2}]},
        state: state({list: [1, 2, 3]}),
        result: {list: [{id: 1}, {id: 2}]},
      },
      'existing state & payload w/ entities': {
        payload: {data: [{id: 1}, {id: 2}], entities: [1, 2]},
        state: state({list: [2, 1]}),
        result: {list: [1, 2]},
      },
    },
  )
})

describe('RESOURCE_DETAIL_READ_REQUEST', () => {
  it('keeps the detail initial state', () => {
    expect(
      reducer(initialState, actionGen(actions.RESOURCE_DETAIL_READ_REQUEST)),
    ).toEqual(state())
  })

  it('resets the detail to initial state in an existing state', () => {
    expect(
      reducer(
        state({detail: 1}),
        actionGen(actions.RESOURCE_DETAIL_READ_REQUEST),
      ),
    ).toEqual(state())
  })
})

describe('RESOURCE_DETAIL_READ_SUCCESS', () => {
  cases(
    'set/overrides detail',
    opts => {
      const action = actionGen(
        actions.RESOURCE_DETAIL_READ_SUCCESS,
        opts.payload,
      )
      expect(reducer(opts.state, action)).toEqual(state(opts.result))
    },
    {
      'initial state & payload w/ only data': {
        payload: {data: {id: 1}},
        state: initialState,
        result: {detail: {id: 1}},
      },
      'initial state & payload w/ entities': {
        payload: {data: {id: 1}, entities: 1},
        state: initialState,
        result: {detail: 1},
      },
      'existing state & payload w/ only data': {
        payload: {data: {id: 2}},
        state: state({detail: {id: 1}}),
        result: {detail: {id: 2}},
      },
      'existing state & payload w/ entities': {
        payload: {data: {id: 2}, entities: 2},
        state: state({detail: 1}),
        result: {detail: 2},
      },
    },
  )
})

describe('RESOURCE_UPDATE_SUCCESS', () => {
  cases(
    'updates non-object data',
    opts => {
      const action = actionGen(
        actions.RESOURCE_UPDATE_SUCCESS,
        opts.payload,
        opts.meta,
      )
      expect(reducer(opts.state, action)).toEqual(state(opts.result))
    },
    {
      'payload w/ only data': {
        payload: {data: 8},
        meta: {request: {needle: 5}},
        state: state({list: [4, 5, 6]}),
        result: {list: [4, 8, 6]},
      },
      'payload w/ entities': {
        payload: {data: {id: 8}, entities: 8},
        meta: {request: {needle: 5}},
        state: state({list: [4, 5, 6]}),
        result: {list: [4, 8, 6]},
      },
    },
  )

  cases(
    'updates an object data',
    opts => {
      const action = actionGen(
        actions.RESOURCE_UPDATE_SUCCESS,
        opts.payload,
        opts.meta,
      )
      expect(reducer(state(opts.state), action)).toEqual(state(opts.result))
    },
    {
      'payload w/ only data': {
        state: {list: [{id: 1, title: 'test'}, {id: 2, title: 'test2'}]},
        payload: {data: {title: 'test3'}},
        meta: {request: {needle: {id: 2}}},
        result: {list: [{id: 1, title: 'test'}, {id: 2, title: 'test3'}]},
      },

      // -- TODO: decide how payload with entities should be handled
      // 'payload w/ entities': {
      //   payload: {data: {id: 8}, entities: 8},
      //   meta: {request: {needle: 5}},
      //   state: {list: [4, 5, 6]},
      //   result: {list: [4, 8, 6]},
      // },
    },
  )

  cases(
    'does nothing when data is not in state',
    opts => {
      const action = actionGen(
        actions.RESOURCE_UPDATE_SUCCESS,
        opts.payload,
        opts.meta,
      )
      expect(reducer(opts.state, action)).toEqual(state(opts.result))
    },
    {
      'payload w/ only data': {
        state: state({list: [{id: 1, title: 'test'}, {id: 2, title: 'test2'}]}),
        payload: {data: {title: 'test3'}},
        meta: {request: {needle: {id: 3}}},
        result: {list: [{id: 1, title: 'test'}, {id: 2, title: 'test2'}]},
      },
    },
  )
})

describe('RESOURCE_DELETE_SUCCESS', () => {
  cases(
    'removes from state',
    opts => {
      const action = actionGen(
        actions.RESOURCE_DELETE_SUCCESS,
        opts.payload,
        opts.meta,
      )
      expect(reducer(opts.state, action)).toEqual(opts.result)
    },
    {
      'initial state': {
        payload: {data: undefined},
        meta: {request: {needle: 2}},
        state: initialState,
        result: initialState,
      },
      'existing state': {
        tag: 1,
        payload: {data: undefined},
        meta: {request: {needle: 2}},
        state: state({list: [1, 2, 3]}),
        result: state({list: [1, 3]}),
      },
    },
  )
})
