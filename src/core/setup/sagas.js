import { call, fork, put, take, select } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';
import { hashHistory as history } from 'react-router';

import { firebaseDB } from 'src/core/firebase';
import { getPlanId } from './selectors';
import { getFieldsForPayment, authActions } from 'src/core/auth/';
import * as setupActions from './actions';
import { findPlan } from './plans';
import { stripeConfig } from 'src/core/stripe/';

function requestCustomerRegistrationOnStripe(token, planId, uid, email) {
  const url = `${stripeConfig.paymentApiEndpoint}/customers`;
  return axios.post(url, { token, planId, uid, email })
    .then((res) => ({ res }))
    .catch((err) => ({ err }));
}

function savePaymentToDB(uid, customerId, planId) {
  const retention = findPlan(planId).retention;
  const key = `users/${uid}`;
  const updates = {
    [`${key}/customerId`]: customerId,
    [`${key}/planId`]: planId,
    [`${key}/retention`]: retention,
    [`${key}/updatedAt`]: moment().utc().format(),
  };
  firebaseDB.ref().update(updates);
}

function* registerPayment({ token }) {
  const { id, email } = yield(select(getFieldsForPayment));
  const planId = yield(select(getPlanId));
  const { res, err } = yield call(
    requestCustomerRegistrationOnStripe, token, planId, id, email);
  if (err) {
    const { code } = err.response.data;
    yield put(setupActions.registerPaymentError(code));
    return;
  }
  const customerId = res.data.id;
  savePaymentToDB(id, customerId, planId);
  yield put(authActions.paymentFulfilled({ customerId, planId }));
  history.replace('/setup/complete');
}

function *watchRegisterPayment() {
  while (true) {
    const { payload } = yield take(`${setupActions.registerPayment}`);
    yield fork(registerPayment, payload);
  }
}

export const setupSagas = [
  fork(watchRegisterPayment),
];
