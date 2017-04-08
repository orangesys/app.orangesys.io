import { call, fork, put, take, select } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';
import MockAdapter from 'axios-mock-adapter';
import * as actions from './actions';
import { orangesysApiConfig } from 'src/core/orangesys-api';
import { getTelegraf, getUid } from 'src/core/auth';
import { logException } from 'src/core/logger';
import { firebaseDB } from 'src/core/firebase';
import { validateInquiry } from './validator';
import { getInquiry } from './selectors';

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
      if (mock) { mock.restore(); }
      return { storageUsage: data.storageUsage };
    })
    .catch(err => {
      if (mock) { mock.restore(); }
      return { err };
    });
};

const saveInqueryOnDB = (uid, body) => {
  const now = moment().utc().format('YYYY-MM-DDTHH:mm:ss-SSS\\Z');
  const key = `inquiries/${now}`;
  const updates = {
    [`${key}/uid`]: uid,
    [`${key}/body`]: body,
  };
  return firebaseDB.ref().update(updates)
    .then(res => ({ res }))
    .catch(err => ({ err }));
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

function* sendInquiry() {
  const inquiry = yield select(getInquiry);
  const body = inquiry.get('body');
  const inputErrors = validateInquiry({ body });
  if (!inputErrors.isEmpty()) {
    yield put(actions.sendInquiryValidationFailed(inputErrors));
    return;
  }
  const uid = yield select(getUid);
  const { err } = yield call(saveInqueryOnDB, uid, body);
  if (err) {
    logException(err);
    yield put(actions.sendInquiryFailed());
    return;
  }

  yield put(actions.sendInquiryFinished());
}


function* watchFetchInfluxDBStorageUsage() {
  while (true) {
    yield take(`${actions.fetchInfluxDBStorageUsage}`);
    yield fork(fetchInfluxDBStorageUsage);
  }
}

function* watchSendInquiry() {
  while (true) {
    yield take(`${actions.sendInquiry}`);
    yield fork(sendInquiry);
  }
}


export const dashboardSagas = [
  fork(watchFetchInfluxDBStorageUsage),
  fork(watchSendInquiry),
];
