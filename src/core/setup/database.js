import { firebaseDB } from 'src/core/firebase';
import moment from 'moment';
import { findPlan } from 'src/core/plans';
import { SERVER_SETUP_STATUS } from 'src/core/server_setup';

export function savePaymentToDB({ uid, customerId, planId, subscriptionId }) {
  const retention = findPlan(planId).retention;
  const key = `users/${uid}`;
  const updates = {
    [`${key}/customerId`]: customerId,
    [`${key}/subscriptionId`]: subscriptionId,
    [`${key}/planId`]: planId,
    [`${key}/retention`]: retention,
    [`${key}/serverSetup/status`]: SERVER_SETUP_STATUS.WAIT_STARTING,
    [`${key}/updatedAt`]: moment().utc().format(),
  };
  firebaseDB.ref().update(updates);
}

export function updateServerSetupStatus(uid, status, data) {
  const key = `users/${uid}`;
  const updates = {
    [`${key}/serverSetup/status`]: status,
    [`${key}/updatedAt`]: moment().utc().format(),
  };
  if (data.errorCode) {
    updates[`${key}/serverSetup/errorCode`] = data.errorCode;
  }
  if (data.errorMessage) {
    updates[`${key}/serverSetup/errorMessage`] = data.errorMessage;
  }
  firebaseDB.ref().update(updates);
}

export function fetchServerSetupTime(uid) {
  return firebaseDB.ref(`users/${uid}/serverSetup/startedAt`).once('value')
    .then((snapshot) => (moment(snapshot.val())));
}

export function fetchTelegraf(uid) {
  return firebaseDB.ref(`users/${uid}/telegraf`).once('value')
    .then(snapshot => (snapshot.val()));
}

export function saveTelegrafToDB(uid, { consumerId, token }) {
  const key = `users/${uid}`;
  const updates = {
    [`${key}/telegraf/consumerId`]: consumerId,
    [`${key}/telegraf/token`]: token,
    [`${key}/updatedAt`]: moment().utc().format(),
  };
  firebaseDB.ref().update(updates);
}

export function updateServerSetupStatusToBuilding(uid) {
  const key = `users/${uid}`;
  const now = moment().utc().format();
  const updates = {
    [`${key}/serverSetup/status`]: SERVER_SETUP_STATUS.BUILDING,
    [`${key}/serverSetup/startedAt`]: now,
    [`${key}/updatedAt`]: now,
  };
  firebaseDB.ref().update(updates);
}

export function updateServerSetupStatusToCompleted(uid) {
  const key = `users/${uid}`;
  const now = moment().utc().format();
  const updates = {
    [`${key}/serverSetup/status`]: SERVER_SETUP_STATUS.COMPLETED,
    [`${key}/serverSetup/completedAt`]: now,
    [`${key}/updatedAt`]: now,
  };
  firebaseDB.ref().update(updates);
}

export function savePingErrors(uid, errReponse) {
  const key = `users/${uid}`;
  const now = moment().utc().format();
  const updates = {
    [`${key}/serverSetup/pingErrors/${now}`]: errReponse.toString(),
    [`${key}/updatedAt`]: now,
  };
  firebaseDB.ref().update(updates);
}
