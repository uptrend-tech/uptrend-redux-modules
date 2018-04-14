// https://github.com/diegohaz/arc/wiki/Sagas
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#resource
import { camelizeKeys, decamelizeKeys } from 'humps';
import { consoleErrorRecovery, safeSaga } from 'rides/store/helpers';
import { takeEvery, put, call } from 'redux-saga/effects';

import { apiDelete, apiGet, apiPost, apiPut } from 'rides/store/callApi/sagas';

import * as actions from './actions';

export function* createResource(api, { data }, { resource, thunk, entityType }) {
  try {
    const resp = yield call(apiPost, api, `/${resource}`, decamelizeKeys(data));
    yield put(
      actions.resourceCreateSuccess(
        resource,
        entityType,
        camelizeKeys(resp.data),
        { data },
        thunk,
      ),
    );
  } catch (e) {
    yield put(
      actions.resourceCreateFailure(
        resource,
        entityType,
        camelizeKeys(e),
        { data },
        thunk,
      ),
    );
  }
}

export function* createResourceList(api, { data }, { resource, thunk, entityType }) {
  const params = decamelizeKeys(data);
  try {
    const resp = yield call(apiPost, api, `/${resource}`, params);
    yield put(
      actions.resourceListCreateSuccess(
        resource,
        entityType,
        camelizeKeys(resp.data),
        params, // data,
        thunk,
      ),
    );
  } catch (e) {
    yield put(
      actions.resourceListCreateFailure(
        resource,
        entityType,
        camelizeKeys(e),
        data,
        thunk,
      ),
    );
  }
}

export function* readResourceList(api, { params }, { resource, thunk, entityType }) {
  try {
    const resp = yield call(apiGet, api, `/${resource}`, params);

    yield put(
      actions.resourceListReadSuccess(
        resource,
        entityType,
        camelizeKeys(resp.data),
        { params },
        thunk,
      ),
    );
  } catch (e) {
    yield put(
      actions.resourceListReadFailure(
        resource,
        entityType,
        camelizeKeys(e),
        { params },
        thunk,
      ),
    );
  }
}

export function* readResourceDetail(api, { needle }, { resource, thunk, entityType }) {
  try {
    const resp = yield call(apiGet, api, `/${resource}/${needle}`);
    yield put(
      actions.resourceDetailReadSuccess(
        resource,
        entityType,
        camelizeKeys(resp.data),
        { needle },
        thunk,
      ),
    );
  } catch (e) {
    yield put(
      actions.resourceDetailReadFailure(
        resource,
        entityType,
        camelizeKeys(e),
        { needle },
        thunk,
      ),
    );
  }
}

export function* updateResource(api, { needle, data }, { resource, thunk, entityType }) {
  try {
    const resp = yield call(apiPut, api, `/${resource}/${needle}`, decamelizeKeys(data));
    yield put(
      actions.resourceUpdateSuccess(
        resource,
        entityType,
        camelizeKeys(resp.data),
        { needle, data },
        thunk,
      ),
    );
  } catch (e) {
    yield put(
      actions.resourceUpdateFailure(
        resource,
        entityType,
        camelizeKeys(e),
        { needle, data },
        thunk,
      ),
    );
  }
}

export function* deleteResource(api, { needle }, { resource, thunk, entityType }) {
  try {
    yield call(apiDelete, api, `/${resource}/${needle}`);
    yield put(actions.resourceDeleteSuccess(resource, entityType, { needle }, thunk));
  } catch (e) {
    yield put(
      actions.resourceDeleteFailure(
        resource,
        entityType,
        camelizeKeys(e),
        { needle },
        thunk,
      ),
    );
  }
}

export function* watchResourceCreateRequest(api, { payload, meta }) {
  yield call(createResource, api, payload, meta);
}

export function* watchResourceListCreateRequest(api, { payload, meta }) {
  yield call(createResourceList, api, payload, meta);
}

export function* watchResourceListReadRequest(api, { payload, meta }) {
  yield call(readResourceList, api, payload, meta);
}

export function* watchResourceDetailReadRequest(api, { payload, meta }) {
  yield call(readResourceDetail, api, payload, meta);
}

export function* watchResourceUpdateRequest(api, { payload, meta }) {
  yield call(updateResource, api, payload, meta);
}

export function* watchResourceDeleteRequest(api, { payload, meta }) {
  yield call(deleteResource, api, payload, meta);
}

export default function*({ api }) {
  const safe = safeSaga(consoleErrorRecovery);

  yield takeEvery(actions.RESOURCE_CREATE_REQUEST, safe(watchResourceCreateRequest, api));

  yield takeEvery(
    actions.RESOURCE_LIST_CREATE_REQUEST,
    safe(watchResourceListCreateRequest, api),
  );

  yield takeEvery(
    actions.RESOURCE_LIST_READ_REQUEST,
    safe(watchResourceListReadRequest, api),
  );

  yield takeEvery(
    actions.RESOURCE_DETAIL_READ_REQUEST,
    safe(watchResourceDetailReadRequest, api),
  );

  yield takeEvery(actions.RESOURCE_UPDATE_REQUEST, safe(watchResourceUpdateRequest, api));

  yield takeEvery(actions.RESOURCE_DELETE_REQUEST, safe(watchResourceDeleteRequest, api));
}
