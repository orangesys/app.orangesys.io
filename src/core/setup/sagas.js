import { call, fork, put, take, select } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';
import { hashHistory as history } from 'react-router';

import { firebaseDB } from 'src/core/firebase';
import { getPlanId } from './selectors';
import { getFieldsForPayment, authActions } from 'src/core/auth/';
import * as setupActions from './actions';
import { findPlan } from './plans';
import { stripeConfig } from 'src/core/stripe';
import { telegrafConfig } from 'src/core/telegraf';


function requestCustomerRegistrationOnStripe(token, planId, uid, email) {
  const url = `${stripeConfig.paymentApiEndpoint}/customers`;
  return axios.post(url, { token, planId, uid, email })
    .then((res) => ({ res }))
    .catch((err) => ({ err }));
}

function requestTelegraphToken(planId) {
  const { retention } = findPlan(planId);
  const url = `${telegrafConfig.tokenApiEndpoint}/create?rp=${retention}`;
  return axios.post(url)
    .then((res) => ({ res }))
    .catch((err) => ({ err }));
}


function savePaymentToDB({ uid, customerId, planId, telegraf }) {
  const retention = findPlan(planId).retention;
  const key = `users/${uid}`;
  const updates = {
    [`${key}/customerId`]: customerId,
    [`${key}/planId`]: planId,
    [`${key}/retention`]: retention,
    [`${key}/updatedAt`]: moment().utc().format(),
  };
  if (telegraf) {
    updates[`${key}/telegraf/consumerId`] = telegraf.consumerId;
    updates[`${key}/telegraf/token`] = telegraf.token;
  }
  firebaseDB.ref().update(updates);
}

function* registerPayment({ stripeToken }) {
  const { uid, email } = yield(select(getFieldsForPayment));
  const planId = yield(select(getPlanId));

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

  // generate telegraf token
  const tokenRequestResult = yield call(requestTelegraphToken, planId);
  console.log("tokenRequestResult:", tokenRequestResult)
  const telegraf = tokenRequestResult.err ? null : tokenRequestResult.res.data
  console.log("telegraf:", telegraf)
  savePaymentToDB({ uid, customerId, planId, telegraf });
  yield put(authActions.paymentFulfilled({ customerId, planId }));
  history.replace('/setup/complete');
}

function *watchRegisterPayment() {
  while (true) {
    const { payload } = yield take(`${setupActions.registerPayment}`);
    yield fork(registerPayment, { stripeToken: payload.token });
  }
}

export const setupSagas = [
  fork(watchRegisterPayment),
];
