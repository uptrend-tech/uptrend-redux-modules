export const RESOURCE_CREATE_REQUEST = 'RESOURCE_CREATE_REQUEST'
export const RESOURCE_CREATE_SUCCESS = 'RESOURCE_CREATE_SUCCESS'
export const RESOURCE_CREATE_FAILURE = 'RESOURCE_CREATE_FAILURE'

export const resourceCreateRequest = (resource, data, entityType) => ({
  type: RESOURCE_CREATE_REQUEST,
  payload: {data},
  meta: {
    resource,
    entityType,
    thunk: `${resource}Create`,
  },
})

export const resourceCreateSuccess = (
  resource,
  entityType,
  payload,
  request,
  thunk,
) => ({
  type: RESOURCE_CREATE_SUCCESS,
  payload: {
    ...payload,
    resource: {path: resource},
    entityType,
  },
  meta: {
    request,
    thunk,
    resource,
    entityType,
    normalizeEntities: true,
  },
})

export const resourceCreateFailure = (
  resource,
  entityType,
  error,
  request,
  thunk,
) => ({
  type: RESOURCE_CREATE_FAILURE,
  error: true,
  payload: error,
  meta: {
    request,
    resource,
    entityType,
    thunk,
  },
})

export const RESOURCE_LIST_CREATE_REQUEST = 'RESOURCE_LIST_CREATE_REQUEST'
export const RESOURCE_LIST_CREATE_SUCCESS = 'RESOURCE_LIST_CREATE_SUCCESS'
export const RESOURCE_LIST_CREATE_FAILURE = 'RESOURCE_LIST_CREATE_FAILURE'

export const resourceListCreateRequest = (resource, data, entityType) => ({
  type: RESOURCE_LIST_CREATE_REQUEST,
  payload: {data},
  meta: {
    resource,
    entityType,
    thunk: `${resource}ListCreate`,
  },
})

export const resourceListCreateSuccess = (
  resource,
  entityType,
  payload,
  request,
  thunk,
) => ({
  type: RESOURCE_LIST_CREATE_SUCCESS,
  payload: {
    ...payload,
    resource: {path: resource},
    entityType,
  },
  meta: {
    request,
    thunk,
    resource,
    entityType,
    normalizeEntities: true,
  },
})

export const resourceListCreateFailure = (
  resource,
  entityType,
  error,
  request,
  thunk,
) => ({
  type: RESOURCE_LIST_CREATE_FAILURE,
  error: true,
  payload: error,
  meta: {
    request,
    entityType,
    thunk,
    resource,
  },
})

export const RESOURCE_LIST_READ_REQUEST = 'RESOURCE_LIST_READ_REQUEST'
export const RESOURCE_LIST_READ_SUCCESS = 'RESOURCE_LIST_READ_SUCCESS'
export const RESOURCE_LIST_READ_FAILURE = 'RESOURCE_LIST_READ_FAILURE'

export const resourceListReadRequest = (resource, params, entityType) => ({
  type: RESOURCE_LIST_READ_REQUEST,
  payload: {params},
  meta: {
    resource,
    entityType,
    thunk: `${resource}ListRead`,
  },
})

export const resourceListReadSuccess = (
  resource,
  entityType,
  payload,
  request,
  thunk,
) => ({
  type: RESOURCE_LIST_READ_SUCCESS,
  payload: {
    ...payload,
    resource: {path: resource},
    entityType,
  },
  meta: {
    request,
    thunk,
    resource,
    entityType,
    normalizeEntities: true,
  },
})

export const resourceListReadFailure = (
  resource,
  entityType,
  error,
  request,
  thunk,
) => ({
  type: RESOURCE_LIST_READ_FAILURE,
  error: true,
  payload: error,
  meta: {
    request,
    entityType,
    thunk,
    resource,
  },
})

export const RESOURCE_DETAIL_READ_REQUEST = 'RESOURCE_DETAIL_READ_REQUEST'
export const RESOURCE_DETAIL_READ_SUCCESS = 'RESOURCE_DETAIL_READ_SUCCESS'
export const RESOURCE_DETAIL_READ_FAILURE = 'RESOURCE_DETAIL_READ_FAILURE'

export const resourceDetailReadRequest = (resource, needle, entityType) => ({
  type: RESOURCE_DETAIL_READ_REQUEST,
  payload: {needle},
  meta: {
    entityType,
    resource,
    thunk: `${resource}DetailRead`,
  },
})

export const resourceDetailReadSuccess = (
  resource,
  entityType,
  payload,
  request,
  thunk,
) => ({
  type: RESOURCE_DETAIL_READ_SUCCESS,
  payload: {
    ...payload,
    resource: {path: resource},
    entityType,
  },
  meta: {
    request,
    thunk,
    resource,
    entityType,
    normalizeEntities: true,
  },
})

export const resourceDetailReadFailure = (
  resource,
  entityType,
  error,
  request,
  thunk,
) => ({
  type: RESOURCE_DETAIL_READ_FAILURE,
  error: true,
  payload: error,
  meta: {
    entityType,
    request,
    thunk,
    resource,
  },
})

export const RESOURCE_UPDATE_REQUEST = 'RESOURCE_UPDATE_REQUEST'
export const RESOURCE_UPDATE_SUCCESS = 'RESOURCE_UPDATE_SUCCESS'
export const RESOURCE_UPDATE_FAILURE = 'RESOURCE_UPDATE_FAILURE'

export const resourceUpdateRequest = (resource, needle, data, entityType) => ({
  type: RESOURCE_UPDATE_REQUEST,
  payload: {needle, data},
  meta: {
    entityType,
    resource,
    thunk: `${resource}Update`,
  },
})

export const resourceUpdateSuccess = (
  resource,
  entityType,
  payload,
  request,
  thunk,
) => ({
  type: RESOURCE_UPDATE_SUCCESS,
  payload: {
    ...payload,
    resource: {path: resource},
    entityType,
  },
  meta: {
    request,
    thunk,
    resource,
    entityType,
    normalizeEntities: true,
  },
})

export const resourceUpdateFailure = (
  resource,
  entityType,
  error,
  request,
  thunk,
) => ({
  type: RESOURCE_UPDATE_FAILURE,
  error: true,
  payload: error,
  meta: {
    entityType,
    request,
    thunk,
    resource,
  },
})

export const RESOURCE_DELETE_REQUEST = 'RESOURCE_DELETE_REQUEST'
export const RESOURCE_DELETE_SUCCESS = 'RESOURCE_DELETE_SUCCESS'
export const RESOURCE_DELETE_FAILURE = 'RESOURCE_DELETE_FAILURE'

export const resourceDeleteRequest = (resource, needle, entityType) => ({
  type: RESOURCE_DELETE_REQUEST,
  payload: {needle},
  meta: {
    entityType,
    resource,
    thunk: `${resource}Delete`,
  },
})

export const resourceDeleteSuccess = (
  resource,
  entityType,
  needle,
  request,
  thunk,
) => ({
  type: RESOURCE_DELETE_SUCCESS,
  payload: {
    resource: {path: resource, needle},
    entityType,
  },
  meta: {
    request,
    thunk,
    resource,
    entityType,
    normalizeEntities: true,
  },
})

export const resourceDeleteFailure = (
  resource,
  entityType,
  error,
  request,
  thunk,
) => ({
  type: RESOURCE_DELETE_FAILURE,
  error: true,
  payload: error,
  meta: {
    entityType,
    request,
    thunk,
    resource,
  },
})
