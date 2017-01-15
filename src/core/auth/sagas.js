import firebase from 'firebase';
import { call, fork, put, take, select } from 'redux-saga/effects';
import { hashHistory as history } from 'react-router';
import moment from 'moment';

import { firebaseAuth, firebaseDB, firebaseErrors } from 'src/core/firebase';
import { updateEmail } from 'src/core/db_operations';
import * as authActions from './actions';
import * as validators from './validator';
import { fetchAuth } from './index';
import { getUid } from './selectors';
import { logException } from 'src/core/logger';


function executeFetchAuth() {
  return fetchAuth()
    .then(user => ({ user }))
    .catch(error => ({ error }));
}

function saveNewUserToDB(uid, email, companyName, fullName) {
  firebaseDB.ref(`users/${uid}`).set({
    companyName,
    fullName,
    email,
    createdAt: moment.utc().format(),
  });
}

function payloadForSignInFulfilled(user) {
  return {
    uid: user.uid,
    email: user.email,
    planId: user.planId,
    emailVerified: user.emailVerified,
    companyName: user.companyName,
    fullName: user.fullName,
    customerId: user.customerId,
    providerId: user.providerId,
    serverSetup: user.serverSetup,
    telegraf: user.telegraf,
    providerData: user.providerData,
  };
}

function executeEmailVerification(params) {
  return firebase.auth()
    .applyActionCode(params.oobCode)
    .then(result => ({ result }))
    .catch(error => ({ error }));
}

function doSendPasswordResetEmail(email) {
  return firebaseAuth.sendPasswordResetEmail(email)
    .then(result => ({ result }))
    .catch(error => ({ error }));
}

function* signUp(inputs) {
  const errors = validators.validate(inputs);
  if (!errors.isEmpty()) {
    yield put(authActions.signUpValidationFailed(errors));
    return;
  }
  try {
    const user = yield call(
      [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
      inputs.email, inputs.password);
    user.sendEmailVerification();
    saveNewUserToDB(user.uid, user.email, inputs.companyName, inputs.fullName);
    yield put(authActions.signUpFulfilled(user));
    // const { user } = yield executeFetchAuth();
    yield history.replace('/verification-guide');
  } catch (e) {
    const signUpError = firebaseErrors[e.code];
    yield put(authActions.signUpFailed(signUpError));
  }
}

function* signUpWithGoogle(inputs) {
  const errors = validators.validate(inputs);
  if (!errors.isEmpty()) {
    yield put(authActions.signUpValidationFailed(errors));
    return;
  }
  const user = firebaseAuth.currentUser;
  saveNewUserToDB(user.uid, user.email, inputs.companyName, inputs.fullName);
  yield put(authActions.signUpFulfilled(user));
  yield history.replace('/');
}

function* signUpWithGithub(inputs) {
  const errors = validators.validate(inputs);
  if (!errors.isEmpty()) {
    yield put(authActions.signUpValidationFailed(errors));
    return;
  }
  const user = firebaseAuth.currentUser;
  saveNewUserToDB(user.uid, user.email, inputs.companyName, inputs.fullName);
  user.sendEmailVerification();
  yield put(authActions.signUpFulfilled(user));
  yield history.replace('/');
}

function* startSigningUpWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const signInResult = yield call(
      [firebaseAuth, firebaseAuth.signInWithPopup],
      provider
    );
    const currentUser = signInResult.user;
    const { user } = yield call(executeFetchAuth);
    if (user && user.userDataExists) {
      yield put(authActions.signInFulfilled(payloadForSignInFulfilled(user)));
      yield history.replace('/');
      return;
    }
    yield put(authActions.finishConnectingToGoogleForSignUp(currentUser));
  } catch (e) {
    logException(e);
  }
}

function* startSigningUpWithGithub() {
  try {
    const provider = new firebase.auth.GithubAuthProvider();
    const signInResult = yield call(
      [firebaseAuth, firebaseAuth.signInWithPopup],
      provider
    );
    const currentUser = signInResult.user;
    const { user } = yield call(executeFetchAuth);
    if (user && user.userDataExists) {
      yield put(authActions.signInFulfilled(payloadForSignInFulfilled(currentUser)));
      yield history.replace('/');
      return;
    }
    yield put(authActions.finishConnectingToGithubForSignUp(currentUser));
  } catch (e) {
    const signUpError = e.code ? firebaseErrors[e.code] : 'ログインに失敗しました';
    yield put(authActions.signUpFailed(signUpError));
  }
}

function* signIn(inputs) {
  try {
    yield call(
      [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
      inputs.email, inputs.password);
    const { user } = yield call(executeFetchAuth);
    yield put(authActions.signInFulfilled(payloadForSignInFulfilled(user)));
    yield history.replace('/');
  } catch (e) {
    logException(e);
    const signInError = firebaseErrors[e.code] || 'ログインに失敗しました';
    yield put(authActions.signInFailed(signInError));
  }
}

function* signInWithOAuth(provider) {
  try {
    const signInResult = yield call(
      [firebaseAuth, firebaseAuth.signInWithPopup], provider
    );
    const firebaseUser = signInResult.user;
    const { user } = yield call(executeFetchAuth);
    if (!user.userDataExists) {
      if (provider.providerId === 'github.com') {
        yield put(authActions.finishConnectingToGithubForSignUp(firebaseUser));
      } else {
        yield put(authActions.finishConnectingToGoogleForSignUp(firebaseUser));
      }

      yield history.replace('/sign-up');
      return;
    }
    yield put(authActions.signInFulfilled(payloadForSignInFulfilled(user)));
    yield history.replace('/');
  } catch (e) {
    logException(e);
    const signInError = e.code ? firebaseErrors[e.code] : 'ログインに失敗しました';
    yield put(authActions.signInFailed(signInError));
  }
}

function* signOut() {
  try {
    yield call([firebaseAuth, firebaseAuth.signOut]);
    yield history.replace('/sign-in');
  } catch (e) {
    logException(e);
  }
}

function* sendEmailVerification() {
  const user = firebaseAuth.currentUser;
  user.sendEmailVerification();
  yield put(authActions.emailVerificationSent());
}

function* verifyEmail(params) {
  const { error } = yield call(executeEmailVerification, params);
  if (error) {
    yield put(authActions.verifyEmailFailed());
    return;
  }
  yield put(authActions.verifyEmailFinished());
}

function* sendPasswordResetMail({ email }) {
  const errors = validators.validate({ email });
  if (!errors.isEmpty()) {
    yield put(authActions.sendPasswordResetMailValidationFailed(errors));
    return;
  }
  const { error } = yield call(doSendPasswordResetEmail, email);
  if (error) {
    yield put(authActions.sendPasswordResetMailFailed());
    return;
  }
  yield put(authActions.sendPasswordResetMailFinished());
}

function* verifyPasswordResetCode(oobCode) {
  const execute = (code) => (
    firebaseAuth.verifyPasswordResetCode(code)
      .then(email => ({ email }))
      .catch(err => ({ err }))
  );
  const { email, err } = yield call(execute, oobCode);
  if (err) {
    yield put(authActions.verifyPasswordResetCodeFailed());
    return;
  }
  yield put(authActions.verifyPasswordResetCodeFinished(email));
}

function* resetPassword({ oobCode, password }) {
  const execute = (code, newPassword) => (
    firebaseAuth.confirmPasswordReset(code, newPassword)
      .then(result => ({ result }))
      .catch(err => ({ err }))
  );
  const { err } = yield call(execute, oobCode, password);
  if (err) {
    const errors = { password: firebaseErrors[err.code] };
    yield put(authActions.resetPasswordFailed(errors));
    return;
  }
  yield put(authActions.resetPasswordFinished());
}

function* recoverEmail({ oobCode }) {
  try {
    const info = yield call([firebaseAuth, firebaseAuth.checkActionCode], oobCode);
    const restoredEmail = info.data.email;
    yield call([firebaseAuth, firebaseAuth.applyActionCode], oobCode);
    const uid = yield(select(getUid));
    yield call(updateEmail, uid, restoredEmail);
    yield put(authActions.recoverEmailFinished({ email: restoredEmail }));
  } catch (e) {
    logException(e);
    yield put(authActions.recoverEmailFailed());
  }
}


// =====================================
//  WATCHERS
// -------------------------------------
function* watchSignUp() {
  while (true) {
    const { payload } = yield take(`${authActions.signUp}`);
    yield fork(signUp, payload);
  }
}

function* watchSignUpWithGoogle() {
  while (true) {
    const { payload } = yield take(`${authActions.signUpWithGoogle}`);
    yield fork(signUpWithGoogle, payload);
  }
}

function* watchSignUpWithGithub() {
  while (true) {
    const { payload } = yield take(`${authActions.signUpWithGithub}`);
    yield fork(signUpWithGithub, payload);
  }
}

function* watchStartSigningUpWithGoogle() {
  while (true) {
    yield take(`${authActions.startSigningUpWithGoogle}`);
    yield fork(startSigningUpWithGoogle);
  }
}

function* watchStartSigningUpWithGithub() {
  while (true) {
    yield take(`${authActions.startSigningUpWithGithub}`);
    yield fork(startSigningUpWithGithub);
  }
}

function* watchSignIn() {
  while (true) {
    const { payload } = yield take(`${authActions.signIn}`);
    yield fork(signIn, payload);
  }
}

function* watchSignInWithGoogle() {
  while (true) {
    yield take(`${authActions.signInWithGoogle}`);
    yield fork(signInWithOAuth, new firebase.auth.GoogleAuthProvider());
  }
}

function* watchSignInWithGithub() {
  while (true) {
    yield take(`${authActions.signInWithGithub}`);
    yield fork(signInWithOAuth, new firebase.auth.GithubAuthProvider());
  }
}

function* watchSignOut() {
  while (true) {
    /* const { payload } =  */ yield take(`${authActions.signOut}`);
    yield fork(signOut);
  }
}

function* watchEmailVerification() {
  while (true) {
    const { payload } = yield take(`${authActions.emailVerification}`);
    yield fork(sendEmailVerification, payload);
  }
}

function* watchVerifyEmail() {
  while (true) {
    const { payload } = yield take(`${authActions.verifyEmail}`);
    yield fork(verifyEmail, payload);
  }
}

function* watchSendPasswordResetMail() {
  while (true) {
    const { payload } = yield take(`${authActions.sendPasswordResetMail}`);
    yield fork(sendPasswordResetMail, payload);
  }
}

function* watchVerifyOobCode() {
  while (true) {
    const { payload } = yield take(`${authActions.verifyPasswordResetCode}`);
    yield fork(verifyPasswordResetCode, payload);
  }
}

function* watchResetPassword() {
  while (true) {
    const { payload } = yield take(`${authActions.resetPassword}`);
    yield fork(resetPassword, payload);
  }
}

function* watchRecoverEmail() {
  while (true) {
    const { payload } = yield take(`${authActions.recoverEmail}`);
    yield fork(recoverEmail, payload);
  }
}

export const authSagas = [
  fork(watchStartSigningUpWithGoogle),
  fork(watchStartSigningUpWithGithub),
  fork(watchSignUp),
  fork(watchSignUpWithGoogle),
  fork(watchSignUpWithGithub),
  fork(watchSignIn),
  fork(watchSignInWithGoogle),
  fork(watchSignInWithGithub),
  fork(watchSignOut),
  fork(watchEmailVerification),
  fork(watchVerifyEmail),
  fork(watchSendPasswordResetMail),
  fork(watchVerifyOobCode),
  fork(watchResetPassword),
  fork(watchRecoverEmail),
];
