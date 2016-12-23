import { call, fork, put, take, select } from 'redux-saga/effects';
import { firebaseDB } from 'src/core/firebase';
import * as actions from './actions';
import { validateProfile } from './validator';
import { getUid, authActions } from 'src/core/auth';

function updateProfileOnDB(uid, { companyName, fullName }) {
  const key = `users/${uid}`;
  const updates = {
    [`${key}/companyName`]: companyName,
    [`${key}/fullName`]: fullName,
  };
  return firebaseDB.ref().update(updates)
    .then(result => ({ result }))
    .catch(err => ({ err }));
}

function* updateProfile(data) {
  const errors = validateProfile(data);
  if (!errors.isEmpty()) {
    yield put(actions.updateProfileValidationFailed(errors));
    return;
  }
  const uid = yield(select(getUid));
  const { err } = yield call(updateProfileOnDB, uid, data);
  if (err) {
    yield put(actions.updateProfileFailed());
    return;
  }
  yield put(actions.updateProfileSucceeded());
  yield put(authActions.updateProfile(data));
}

function* watchUpdateProfile() {
  while (true) {
    const { payload } = yield take(`${actions.updateProfile}`);
    yield fork(updateProfile, payload);
  }
}
export const settingsSagas = [
  fork(watchUpdateProfile),
];
