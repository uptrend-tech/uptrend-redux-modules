// https://github.com/diegohaz/arc/wiki/Sagas
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#resource
import { takeEvery, put, call, fork } from 'redux-saga/effects';
import FileSaver from 'file-saver';

import { consoleErrorRecovery, safeSaga } from 'sow/sagas/helpers';

import * as actions from './actions';

export function* bulkDownloadResource(api, { params }, { resource, thunk }) {
  try {
    const resp = yield call(api.post, `/${resource}`, params, {
      responseType: 'blob',
    });

    if (resp.data.type === 'application/zip') {
      FileSaver.saveAs(resp.data, 'bulk-download.zip');
    }

    yield put(
      actions.resourceBulkDownloadSuccess(resource, resp.data, { params }, thunk),
    );
  } catch (e) {
    yield put(actions.resourceBulkDownloadFailure(resource, e, { params }, thunk));
  }
}

export function* createResource(api, { data }, { resource, thunk }) {
  try {
    // https://github.com/diegohaz/arc/wiki/API-service
    const resp = yield call([api, api.post], `/${resource}`, data);
    // https://github.com/diegohaz/arc/wiki/Actions#async-actions
    yield put(actions.resourceCreateSuccess(resource, resp.data, { data }, thunk));
  } catch (e) {
    yield put(actions.resourceCreateFailure(resource, e, { data }, thunk));
  }
}

export function* readResourceList(api, { params }, { resource, thunk }) {
  try {
    const resp = yield call([api, api.get], `/${resource}`, { params });
    yield put(actions.resourceListReadSuccess(resource, resp.data, { params }, thunk));
  } catch (e) {
    yield put(actions.resourceListReadFailure(resource, e, { params }, thunk));
  }
}

export function* readResourceDetail(api, { needle }, { resource, thunk }) {
  try {
    const resp = yield call([api, api.get], `/${resource}/${needle}`);
    yield put(actions.resourceDetailReadSuccess(resource, resp.data, { needle }, thunk));
  } catch (e) {
    yield put(actions.resourceDetailReadFailure(resource, e, { needle }, thunk));
  }
}

export function* updateResource(api, { needle, data }, { resource, thunk }) {
  try {
    const resp = yield call([api, api.put], `/${resource}/${needle}`, data);
    yield put(
      actions.resourceUpdateSuccess(resource, resp.data, { needle, data }, thunk),
    );
  } catch (e) {
    yield put(actions.resourceUpdateFailure(resource, e, { needle, data }, thunk));
  }
}

export function* deleteResource(api, { needle }, { resource, thunk }) {
  try {
    yield call([api, api.delete], `/${resource}/${needle}`);
    yield put(actions.resourceDeleteSuccess(resource, { needle }, thunk));
  } catch (e) {
    yield put(actions.resourceDeleteFailure(resource, e, { needle }, thunk));
  }
}

export function* watchResourceBulkDownloadRequest(api, { payload, meta }) {
  yield call(bulkDownloadResource, api, payload, meta);
}

export function* watchResourceCreateRequest(api, { payload, meta }) {
  yield call(createResource, api, payload, meta);
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

  yield takeEvery(
    actions.RESOURCE_BULK_DOWNLOAD_REQUEST,
    safe(watchResourceBulkDownloadRequest, api),
  );
  yield takeEvery(actions.RESOURCE_CREATE_REQUEST, safe(watchResourceCreateRequest, api));
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
