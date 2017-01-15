import { call, fork, put, take, select } from 'redux-saga/effects';
import firebase from 'firebase';
import { firebaseAuth, firebaseDB } from 'src/core/firebase';
import { Map } from 'immutable';
import { updateEmail as updateEmailOnDB } from 'src/core/db_operations';
import * as actions from './actions';
import { validateProfile, validateEmailChange } from './validator';
import { getUid, authActions } from 'src/core/auth';
import { logException } from 'src/core/logger';

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

function* changeEmail(data) {
  const errors = validateEmailChange(data);
  if (!errors.isEmpty()) {
    yield put(actions.changeEmailValidationFailed(errors));
    return;
  }
  const { email, password } = data;
  const user = firebaseAuth.currentUser;
  if (email === user.email) {
    yield put(actions.changeEmailValidationFailed(new Map({
      email: 'メールアドレスが同一です',
    })));
    return;
  }
  const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password,
  );
  const authenticate = () => (
    user.reauthenticate(credential)
      .then(result => ({ result }))
      .catch(authError => ({ authError }))
  );
  const { authError } = yield call(authenticate);
  if (authError) {
    yield put(actions.changeEmailValidationFailed(new Map({
      password: 'パスワードが正しくありません',
    })));
    return;
  }
  const updateEmail = () => (
    user.updateEmail(email)
      .then(result => ({ result }))
      .catch(err => ({ err }))
  );
  const { updateError } = yield call(updateEmail);
  if (updateError) {
    yield put(actions.changeEmailFailed());
    return;
  }
  const uid = yield(select(getUid));
  const { dbError } = yield call(updateEmailOnDB, uid, email);
  if (dbError) {
    logException(dbError);
  }
  user.sendEmailVerification();
  setTimeout(() => {
    location.reload();
  }, 1000);
  yield put(actions.changeEmailFinished(data));
  yield put(authActions.emailChanged(email));
}

function* watchUpdateProfile() {
  while (true) {
    const { payload } = yield take(`${actions.updateProfile}`);
    yield fork(updateProfile, payload);
  }
}

function* watchChangeEmail() {
  while (true) {
    const { payload } = yield take(`${actions.changeEmail}`);
    yield fork(changeEmail, payload);
  }
}
export const settingsSagas = [
  fork(watchUpdateProfile),
  fork(watchChangeEmail),
];
