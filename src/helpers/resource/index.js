import React from 'react'
import {Provider} from 'react-redux'
import {done, fulfilled, pending, rejected} from 'redux-saga-thunk'
import ResourceDetailLoader from './components/ResourceDetailLoader'
import ResourceListLoader from './components/ResourceListLoader'

export default ({entities, resource, store}) => {
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
    const action = requestAction(resourcePath, entityType)
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
    (resourcePath, entityType) => params =>
      resourceCreateRequest(resourcePath, params, entityType),
    resourcePath => `${resourcePath}Create`,
    resource.selectors.getDetail,
    entities.selectors.getDetail,
  )

  const resourceDelete = createHelper(
    (resourcePath, entityType) => needle =>
      resourceDeleteRequest(resourcePath, needle, entityType),
    resourcePath => `${resourcePath}Delete`,
    resource.selectors.getList,
    entities.selectors.getList,
  )

  const resourceDetailRead = createHelper(
    (resourcePath, entityType) => (needle, params) =>
      resourceDetailReadRequest(resourcePath, needle, params, entityType),
    resourcePath => `${resourcePath}DetailRead`,
    resource.selectors.getDetail,
    entities.selectors.getDetail,
  )

  const resourceListCreate = createHelper(
    (resourcePath, entityType) => data =>
      resourceListCreateRequest(resourcePath, data, entityType),
    resourcePath => `${resourcePath}ListCreate`,
    resource.selectors.getList,
    entities.selectors.getList,
  )

  const resourceListRead = createHelper(
    (resourcePath, entityType) => params =>
      resourceListReadRequest(resourcePath, params, entityType),
    resourcePath => `${resourcePath}ListRead`,
    resource.selectors.getList,
    entities.selectors.getList,
  )

  const resourceUpdate = createHelper(
    (resourcePath, entityType) => (needle, data) =>
      resourceUpdateRequest(resourcePath, needle, data, entityType),
    resourcePath => `${resourcePath}Update`,
    resource.selectors.getDetail,
    entities.selectors.getDetail,
  )

  const ResourceDetailLoaderWithStore = props => (
    <Provider store={store}>
      <ResourceDetailLoader {...props} />
    </Provider>
  )

  const ResourceListLoaderWithStore = props => (
    <Provider store={store}>
      <ResourceListLoader {...props} />
    </Provider>
  )

  return {
    ResourceDetailLoader: ResourceDetailLoaderWithStore,
    ResourceListLoader: ResourceListLoaderWithStore,
    resourceCreate,
    resourceDelete,
    resourceDetailRead,
    resourceListCreate,
    resourceListRead,
    resourceUpdate,
  }
}
