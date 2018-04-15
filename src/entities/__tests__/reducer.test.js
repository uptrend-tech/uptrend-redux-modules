// https://github.com/diegohaz/arc/wiki/Reducers#unit-testing-reducers
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#entities
import reducer from '../reducer'
import selectorsFactory from '../selectors'
import {ENTITIES_RECEIVE} from '../actions'

const {initialState} = selectorsFactory({
  /* schemas: getSchemas() */
})

const altState = {
  ...initialState,
  foo: {
    id: 1,
    bars: [1, 2, 3],
  },
}

it('returns the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState)
})

it('handles actions', () => {
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
