import {done, fulfilled, pending, rejected} from 'redux-saga-thunk'

const partialStatusActions = name => {
  return {
    done: state => done(state, name),
    fulfilled: state => fulfilled(state, name),
    pending: state => pending(state, name),
    rejected: state => rejected(state, name),
  }
}

export default ({entities, resource}) => {
  const {
    resourceCreateRequest,
    // resourceDeleteRequest,
    // resourceDetailReadRequest,
    // resourceListCreateRequest,
    // resourceListReadRequest,
    // resourceUpdateRequest,
  } = resource.actions

  const resourceCreate = (resourcePath, entityType) => {
    const resourceSelect = state =>
      resource.selectors.getDetail(state, resourcePath)

    return {
      action: data => resourceCreateRequest(resourcePath, data, entityType),
      selectors: {
        ...partialStatusActions(`${resourcePath}Create`),
        resource: resourceSelect,
        result: state => {
          const detail = resourceSelect(state)
          if (entityType) {
            return entities.selectors.getDetail(state, entityType, detail)
          }
          return detail
        },
      },
    }
  }

  return {
    resourceCreate,
    // resourceDelete,
    // resourceDetailRead,
    // resourceListCreate,
    // resourceListRead,
    // resourceUpdate,
  }
}
