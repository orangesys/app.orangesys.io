import { call, fork, put, take, select } from 'redux-saga/effects';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actions from './actions';
import { orangesysApiConfig } from 'src/core/orangesys-api';
import { getTelegraf, getUid } from 'src/core/auth';
import { logException } from 'src/core/logger';

const apiDebugMode = API_DEBUG_MODE === 'true'; // eslint-disable-line no-undef

const requestInfluxDBStorageUsage = (uid, consumerId) => {
  const url = `${orangesysApiConfig.apiEndpoint}/storageusage?uuid=${uid}&consumerId=${consumerId}`;
  let mock = null;
  if (apiDebugMode) {
    mock = new MockAdapter(axios);
    mock.onGet(url).reply(200, {
      storageUsage: 3328599654,
    });
  }
  return axios.get(url, { timeout: 1000 * 5 })
    .then(({ data }) => {
      if (mock) { mock.reset(); }
      return { storageUsage: data.storageUsage };
    })
    .catch(err => {
      if (mock) { mock.reset(); }
      return { err };
    });
};

function* fetchInfluxDBStorageUsage() {
  const { consumerId } = yield select(getTelegraf);
  const uid = yield select(getUid);
  const { storageUsage, err } = yield call(requestInfluxDBStorageUsage, uid, consumerId);
  if (err) {
    logException(err);
    return;
  }
  yield put(actions.fetchInfluxDBStorageUsageFinished({ storageUsage }));
}

function* watchFetchInfluxDBStorageUsage() {
  while (true) {
    yield take(`${actions.fetchInfluxDBStorageUsage}`);
    yield fork(fetchInfluxDBStorageUsage);
  }
}

export const dashboardSagas = [
  fork(watchFetchInfluxDBStorageUsage),
];
