const initialState = {}

const initialResourceState = {
  list: [],
  detail: null,
}

const getResourceState = (state = initialState, resource) =>
  state[resource] || initialResourceState

const getDetail = (state = initialState, resource) =>
  getResourceState(state, resource).detail

const getList = (state = initialState, resource) =>
  getResourceState(state, resource).list

export {
  initialState,
  initialResourceState,
  getList,
  getDetail,
  getResourceState,
}
