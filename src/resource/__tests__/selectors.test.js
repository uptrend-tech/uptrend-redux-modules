import * as selectors from '../selectors'

const state = {
  thing: {
    list: [1, 2, 3],
    detail: 1,
  },
}

describe('resource/selectors', () => {
  test('initialState', () => {
    expect(selectors.initialState).toEqual({})
  })

  test('initialResourceState', () => {
    expect(selectors.initialResourceState).toEqual({
      list: [],
      detail: null,
    })
  })

  test('getResourceState', () => {
    expect(selectors.getResourceState()).toBe(selectors.initialResourceState)
    expect(selectors.getResourceState(undefined, 'thing')).toBe(
      selectors.initialResourceState,
    )
    expect(selectors.getResourceState(state, 'thing')).toBe(state.thing)
  })

  test('getList', () => {
    expect(selectors.getList()).toBe(selectors.initialResourceState.list)
    expect(selectors.getList({})).toBe(selectors.initialResourceState.list)
    expect(selectors.getList(undefined, 'thing')).toBe(
      selectors.initialResourceState.list,
    )
    expect(selectors.getList(state, 'thing')).toBe(state.thing.list)
  })

  test('getDetail', () => {
    expect(selectors.getDetail()).toBe(selectors.initialResourceState.detail)
    expect(selectors.getDetail({})).toBe(selectors.initialResourceState.detail)
    expect(selectors.getDetail(undefined, 'thing')).toBe(
      selectors.initialResourceState.detail,
    )
    expect(selectors.getDetail(state, 'thing')).toBe(state.thing.detail)
  })
})
