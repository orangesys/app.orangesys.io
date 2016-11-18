import { delay } from 'redux-saga';
import { call, fork, put, take, select } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';
import { hashHistory as history } from 'react-router';
import {
  fetchServerSetupTime,
  savePaymentToDB,
  saveTelegrafToDB,
  updateServerSetupStatus,
  updateServerSetupStatusToBuilding,
  updateServerSetupStatusToCompleted,
} from './database';
import { getSelectedPlanId } from './selectors';
import {
  authActions,
  getFieldsForPayment,
  getPlanId,
  getTelegraf,
  getUid,
} from 'src/core/auth/';
import * as setupActions from './actions';
import { findPlan } from './plans';
import { stripeConfig } from 'src/core/stripe';
import { orangesysApiConfig } from 'src/core/orangesys-api';
import { SERVER_SETUP_STATUS } from 'src/core/server_setup';

// ----------------------------------------------------------------------
// HTTP Requests
// ----------------------------------------------------------------------
function requestCustomerRegistrationOnStripe(token, planId, uid, email) {
  const url = `${stripeConfig.paymentApiEndpoint}/customers`;
  return axios.post(url, { token, planId, uid, email })
    .then((res) => ({ res }))
    .catch((err) => ({ err }));
}

function requestBuildingSevers(planId) {
  const { retention } = findPlan(planId);
  const getUrl = `${orangesysApiConfig.apiEndpoint}/`;
  const postUrl = `${orangesysApiConfig.apiEndpoint}/create?rp=${retention}`;
  return axios.get(getUrl, { timeout: 1000 * 5 })
    .then(() => axios.post(postUrl, { timeout: 1000 * 5 }))
    .then((res) => ({ res }))
    .catch((err) => ({ err }));
}

function pingServer({ consumerId, token }) {
  const url = `https://${consumerId}.i.orangesys.io/ping?jwt=${token}`;
  return axios.get(url, { timeout: 1000 * 5 })
    .then((res) => ({ result: !!res.headers['x-influxdb-version'] }))
    .catch((err) => ({ err }));
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
    if (!err.response) {
      yield put(setupActions.registerPaymentError());
      return;
    }
    const { code } = err.response.data;
    yield put(setupActions.registerPaymentError(code));
    return;
  }
  const customerId = res.data.id;
  savePaymentToDB({ uid, customerId, planId });
  yield put(authActions.paymentFulfilled({ customerId, planId }));
  history.replace('/setup/server');
}

function* startBuildingServers() {
  const uid = yield(select(getUid));
  const planId = yield(select(getPlanId));
  const { res, err } = yield call(requestBuildingSevers, planId);
  if (err) {
    const errorCode = 'creation_request_error';
    const errorMessage = err.toString();
    updateServerSetupStatus(uid, SERVER_SETUP_STATUS.ERRORED,
      { errorCode, errorMessage }
    );
    yield put(authActions.serverSetupError({ errorCode }));
    return;
  }
  const telegraf = res.data;
  saveTelegrafToDB(uid, telegraf);
  updateServerSetupStatusToBuilding(uid);
  yield put(authActions.putTelegraf(telegraf));
  yield put(setupActions.keepWaitingForServerBuild());
}

function* keepWaitingForServerBuild() {
  const uid = yield(select(getUid));
  const telegraf = yield(select(getTelegraf));
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
