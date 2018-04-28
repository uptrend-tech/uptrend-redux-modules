import {done, fulfilled, pending, rejected} from 'redux-saga-thunk'

export default ({entities, resource}) => {
  const {
    resourceCreateRequest,
    resourceDeleteRequest,
    resourceDetailReadRequest,
    resourceListCreateRequest,
    resourceListReadRequest,
    resourceUpdateRequest,
  } = resource.actions

  const createHelper = (
    requestAction,
    thunkNameFn,
    resourceSelector,
    entitiesSelector,
  ) => (resourcePath, entityType) => {
    const thunkName = thunkNameFn(resourcePath)
    // TODO decide how to handle extra needle/data for resourceUpdateRequest
    const action = (...args) => requestAction(resourcePath, ...args, entityType)
    const resourceSelect = state => resourceSelector(state, resourcePath)
    const resultsSelect = state => {
      const detail = resourceSelect(state)
      // TODO in future be able to check if actually normalized
      return entityType ? entitiesSelector(state, entityType, detail) : detail
    }

    return {
      action,
      selectors: {
        done: state => done(state, thunkName),
        fulfilled: state => fulfilled(state, thunkName),
        // eslint-disable-next-line jest/no-disabled-tests
        pending: state => pending(state, thunkName),
        rejected: state => rejected(state, thunkName),
        resource: resourceSelect,
        result: resultsSelect,
      },
    }
  }

  const resourceCreate = createHelper(
    resourceCreateRequest,
    resourcePath => `${resourcePath}Create`,
    resource.selectors.getDetail,
    entities.selectors.getDetail,
  )

  const resourceDelete = createHelper(
    resourceDeleteRequest,
    resourcePath => `${resourcePath}Delete`,
    resource.selectors.getList,
    entities.selectors.getList,
  )

  const resourceDetailRead = createHelper(
    resourceDetailReadRequest,
    resourcePath => `${resourcePath}DetailRead`,
    resource.selectors.getDetail,
    entities.selectors.getDetail,
  )

  const resourceListCreate = createHelper(
    resourceListCreateRequest,
    resourcePath => `${resourcePath}ListCreate`,
    resource.selectors.getList,
    entities.selectors.getList,
  )

  const resourceListRead = createHelper(
    resourceListReadRequest,
    resourcePath => `${resourcePath}ListRead`,
    resource.selectors.getList,
    entities.selectors.getList,
  )

  const resourceUpdate = createHelper(
    resourceUpdateRequest,
    resourcePath => `${resourcePath}Update`,
    resource.selectors.getDetail,
    entities.selectors.getDetail,
  )

  return {
    resourceCreate,
    resourceDelete,
    resourceDetailRead,
    resourceListCreate,
    resourceListRead,
    resourceUpdate,
  }
}
