import {done, fulfilled, pending, rejected} from 'redux-saga-thunk'

// const partialStatusActions = name => {
//   return {
//     done: state => done(state, name),
//     fulfilled: state => fulfilled(state, name),
//     pending: state => pending(state, name),
//     rejected: state => rejected(state, name),
//   }
// }

export default ({entities, resource}) => {
  const {
    resourceCreateRequest,
    // resourceDeleteRequest,
    // resourceDetailReadRequest,
    // resourceListCreateRequest,
    // resourceListReadRequest,
    // resourceUpdateRequest,
  } = resource.actions

  const createHelper = (
    requestAction,
    thunkNameFn,
    resourceSelector,
    entitiesSelector,
  ) => (resourcePath, entityType) => {
    const thunkName = thunkNameFn(resourcePath)
    const action = data => requestAction(resourcePath, data, entityType)
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

  // const resourceCreate = (resourcePath, entityType) => {
  //   const action = data => resourceCreateRequest(resourcePath, data, entityType)
  //   const thunkName = `${resourcePath}Create`

  //   const resourceSelect = state =>
  //     resource.selectors.getDetail(state, resourcePath)

  //   const resultsSelect = state => {
  //     const detail = resourceSelect(state)
  //     if (entityType) {
  //       return entities.selectors.getDetail(state, entityType, detail)
  //     }
  //     return detail
  //   }

  //   return {
  //     action,
  //     selectors: {
  //       done: state => done(state, thunkName),
  //       fulfilled: state => fulfilled(state, thunkName),
  //       // eslint-disable-next-line jest/no-disabled-tests
  //       pending: state => pending(state, thunkName),
  //       rejected: state => rejected(state, thunkName),
  //       resource: resourceSelect,
  //       result: resultsSelect,
  //     },
  //   }
  // }

  const resourceCreate = createHelper(
    resourceCreateRequest,
    resourcePath => `${resourcePath}Create`,
    resource.selectors.getDetail,
    entities.selectors.getDetail,
  )

  return {
    resourceCreate,
    // resourceDelete,
    // resourceDetailRead,
    // resourceListCreate,
    // resourceListRead,
    // resourceUpdate,
  }
}
