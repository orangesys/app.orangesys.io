import { delay } from 'redux-saga';
import { call, fork, put, take, select } from 'redux-saga/effects';
import axios from 'axios';
import { has, mapKeys } from 'lodash/object';
import moment from 'moment';
import { hashHistory as history } from 'react-router';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchServerSetupTime,
  fetchTelegraf,
  savePaymentToDB,
  saveTelegrafToDB,
  updateServerSetupStatus,
  updateServerSetupStatusToBuilding,
  updateServerSetupStatusToCompleted,
  setTelegraf,
} from './database';
import { getSelectedPlanId } from './selectors';
import {
  authActions,
  getFieldsForPayment,
  getPlanId,
  getUid,
} from 'src/core/auth/';
import * as setupActions from './actions';
import { findPlan } from 'src/core/plans';
import { stripeConfig } from 'src/core/stripe';
import { orangesysApiConfig } from 'src/core/orangesys-api';
import { SERVER_SETUP_STATUS } from 'src/core/server_setup';
import { logException } from 'src/core/logger';

const apiDebugMode = API_DEBUG_MODE === 'true'; // eslint-disable-line no-undef

const keysToUpperCase = (o) => mapKeys(o, (v, k) => k.toUpperCase());

// ----------------------------------------------------------------------
// HTTP Requests
// ----------------------------------------------------------------------
function requestCustomerRegistrationOnStripe(token, planId, uid, email) {
  const url = `${stripeConfig.paymentApiEndpoint}/customers`;
  return axios.post(url, { token, planId, uid, email })
    .then((res) => ({ res }))
    .catch((err) => ({ err }));
}

function requestBuildingSevers(planId, uid) {
  const { retention } = findPlan(planId);
  const postUrl = `${orangesysApiConfig.apiEndpoint}/create?uuid=${uid}&rp=${retention}`;
  return axios.post(postUrl, { timeout: 1000 * 5 })
    .then((res) => ({ res }))
    .catch((err) => ({ err }));
}

function pingServer({ consumerId, token }) {
  const url = `https://${consumerId}.i.orangesys.io/ping?jwt=${token}`;
  const headerName = 'X-INFLUXDB-VERSION';
  let mock = null;
  if (apiDebugMode) {
    mock = new MockAdapter(axios);
    mock.onHead(url).reply(200, {}, { 'X-Influxdb-Version': '1.1.1' });
  }
  return axios.head(url, { timeout: 1000 * 5 })
    .then(res => {
      if (mock) { mock.reset(); }
      const headers = keysToUpperCase(res.headers);
      return { result: has(headers, headerName) };
    })
    .catch(err => {
      if (mock) { mock.reset(); }
      return { err };
    });
}

// ----------------------------------------------------------------------
// Generators
// ----------------------------------------------------------------------
function* registerPayment({ stripeToken }) {
  const { uid, email } = yield(select(getFieldsForPayment));
  const planId = yield(select(getSelectedPlanId));

  // stripe
  const { res, err } = yield call(
    requestCustomerRegistrationOnStripe, stripeToken, planId, uid, email);
  if (err) {
    logException(err);
    if (!err.response) {
      yield put(setupActions.registerPaymentError());
      return;
    }
    const { code } = err.response.data;
    yield put(setupActions.registerPaymentError(code));
    return;
  }
  const { customerId, subscriptionId } = res.data;
  savePaymentToDB({ uid, planId, customerId, subscriptionId });
  yield put(authActions.paymentFulfilled({ customerId, planId }));
  history.replace('/dashboard/server-setup');
}

function* startBuildingServers() {
  const uid = yield(select(getUid));
  const planId = yield(select(getPlanId));
  const { err } = yield call(requestBuildingSevers, planId, uid);
  if (err) {
    const errorCode = 'creation_request_error';
    const errorMessage = err.toString();
    logException(err);
    updateServerSetupStatus(uid, SERVER_SETUP_STATUS.ERRORED,
      { errorCode, errorMessage }
    );
    yield put(authActions.serverSetupError({ errorCode }));
    return;
  }
  if (apiDebugMode) {
    console.log('apiDebugMode:', apiDebugMode); // eslint-disable-line no-console
    saveTelegrafToDB(uid, {
      consumerId: 'dummy1',
      token:
        'dummy-ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiMGQ1MTkzMmVkMmU0NzcwO' +
        'WRkYTI5NjM0ZGFjYTg4OCJ9.bdNT2pqqlU8ioTw1VuZ74BeiqCQ9p6hmyeIA5P4tGbI',
    });
  }
  updateServerSetupStatusToBuilding(uid);
  yield put(setupActions.keepWaitingForServerBuild());
}

function* keepWaitingForServerBuild() {
  const uid = yield(select(getUid));
  const telegraf = yield call(fetchTelegraf, uid);
  yield put(authActions.setTelegraf(telegraf));
  const startedAt = yield call(fetchServerSetupTime, uid);
  while (true) {
    yield call(delay, 1000 * 30);
    const { result } = yield call(pingServer, telegraf);
    if (result) {
      updateServerSetupStatusToCompleted(uid);
      yield put(authActions.serverSetupFinished());
      history.replace('/');
      return;
    }
    if (moment().diff(startedAt, 'minutes') >= 6) {
      const errorCode = 'server_build_failed';
      yield put(authActions.serverSetupError({ errorCode }));
      updateServerSetupStatus(uid, SERVER_SETUP_STATUS.ERRORED, { errorCode });
      return;
    }
  }
}

// ----------------------------------------------------------------------
// Watcher
// ----------------------------------------------------------------------
function *watchRegisterPayment() {
  while (true) {
    const { payload } = yield take(`${setupActions.registerPayment}`);
    yield fork(registerPayment, { stripeToken: payload.token });
  }
}

function *watchStartBuildingServers() {
  while (true) {
    yield take(`${setupActions.startBuildingServers}`);
    yield fork(startBuildingServers);
  }
}

function *watchKeepWaitingForServerBuild() {
  while (true) {
    yield take(`${setupActions.keepWaitingForServerBuild}`);
    yield fork(keepWaitingForServerBuild);
  }
}

export const setupSagas = [
  fork(watchRegisterPayment),
  fork(watchStartBuildingServers),
  fork(watchKeepWaitingForServerBuild),
];
