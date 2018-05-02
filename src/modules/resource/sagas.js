import {takeEvery, put, call} from 'redux-saga/effects'
import {camelKeys, snakeKeys, consoleErrorRecovery, safeSaga} from '../../utils'
import * as actions from './actions'

export const apiResponseData = response => camelKeys(response.data)

export const apiResponseToPayload = response => ({
  api: {response},
  data: apiResponseData(response),
})

export function* createResource(api, {data}, {resource, thunk, entityType}) {
  try {
    const resp = yield call([api, api.post], `/${resource}`, snakeKeys(data))
    const action = actions.resourceCreateSuccess(
      resource,
      entityType,
      apiResponseToPayload(resp),
      {data},
      thunk,
    )
    yield put(action)
  } catch (e) {
    yield put(
      actions.resourceCreateFailure(
        resource,
        entityType,
        camelKeys(e),
        {data},
        thunk,
      ),
    )
  }
}

export function* createResourceList(
  api,
  {data},
  {resource, thunk, entityType},
) {
  const params = snakeKeys(data)
  try {
    const resp = yield call([api, api.post], `/${resource}`, params)
    const action = actions.resourceListCreateSuccess(
      resource,
      entityType,
      apiResponseToPayload(resp),
      params,
      thunk,
    )
    yield put(action)
  } catch (e) {
    yield put(
      actions.resourceListCreateFailure(
        resource,
        entityType,
        camelKeys(e),
        data,
        thunk,
      ),
    )
  }
}

export function* readResourceList(
  api,
  {params},
  {resource, thunk, entityType},
) {
  try {
    const resp = yield call([api, api.get], `/${resource}`, {params})

    yield put(
      actions.resourceListReadSuccess(
        resource,
        entityType,
        apiResponseToPayload(resp),
        {params},
        thunk,
      ),
    )
  } catch (e) {
    yield put(
      actions.resourceListReadFailure(
        resource,
        entityType,
        camelKeys(e),
        {params},
        thunk,
      ),
    )
  }
}

export function* readResourceDetail(
  api,
  {needle},
  {resource, thunk, entityType},
) {
  try {
    const resp = yield call([api, api.get], `/${resource}/${needle}`)
    yield put(
      actions.resourceDetailReadSuccess(
        resource,
        entityType,
        apiResponseToPayload(resp),
        {needle},
        thunk,
      ),
    )
  } catch (e) {
    yield put(
      actions.resourceDetailReadFailure(
        resource,
        entityType,
        camelKeys(e),
        {needle},
        thunk,
      ),
    )
  }
}

export function* updateResource(
  api,
  {needle, data},
  {resource, thunk, entityType},
) {
  try {
    const resp = yield call(
      [api, api.put],
      `/${resource}/${needle}`,
      snakeKeys(data),
    )
    yield put(
      actions.resourceUpdateSuccess(
        resource,
        entityType,
        apiResponseToPayload(resp),
        {needle, data},
        thunk,
      ),
    )
  } catch (e) {
    yield put(
      actions.resourceUpdateFailure(
        resource,
        entityType,
        camelKeys(e),
        {needle, data},
        thunk,
      ),
    )
  }
}

export function* deleteResource(api, {needle}, {resource, thunk, entityType}) {
  try {
    yield call([api, api.delete], `/${resource}/${needle}`)
    yield put(
      actions.resourceDeleteSuccess(resource, entityType, {needle}, thunk),
    )
  } catch (e) {
    yield put(
      actions.resourceDeleteFailure(
        resource,
        entityType,
        camelKeys(e),
        {needle},
        thunk,
      ),
    )
  }
}

export function* watchResourceCreateRequest(api, {payload, meta}) {
  yield call(createResource, api, payload, meta)
}

export function* watchResourceListCreateRequest(api, {payload, meta}) {
  yield call(createResourceList, api, payload, meta)
}

export function* watchResourceListReadRequest(api, {payload, meta}) {
  yield call(readResourceList, api, payload, meta)
}

export function* watchResourceDetailReadRequest(api, {payload, meta}) {
  yield call(readResourceDetail, api, payload, meta)
}

export function* watchResourceUpdateRequest(api, {payload, meta}) {
  yield call(updateResource, api, payload, meta)
}

export function* watchResourceDeleteRequest(api, {payload, meta}) {
  yield call(deleteResource, api, payload, meta)
}

export default function*({api}) {
  const safe = safeSaga(consoleErrorRecovery)

  yield takeEvery(
    actions.RESOURCE_CREATE_REQUEST,
    safe(watchResourceCreateRequest, api),
  )

  yield takeEvery(
    actions.RESOURCE_LIST_CREATE_REQUEST,
    safe(watchResourceListCreateRequest, api),
  )

  yield takeEvery(
    actions.RESOURCE_LIST_READ_REQUEST,
    safe(watchResourceListReadRequest, api),
  )

  yield takeEvery(
    actions.RESOURCE_DETAIL_READ_REQUEST,
    safe(watchResourceDetailReadRequest, api),
  )

  yield takeEvery(
    actions.RESOURCE_UPDATE_REQUEST,
    safe(watchResourceUpdateRequest, api),
  )

  yield takeEvery(
    actions.RESOURCE_DELETE_REQUEST,
    safe(watchResourceDeleteRequest, api),
  )
}
