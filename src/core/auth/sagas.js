import firebase from 'firebase';
import { call, fork, put, take } from 'redux-saga/effects';
import { browserHistory as history } from 'react-router';
import { firebaseAuth, firebaseDB, firebaseErrors } from 'src/core/firebase';

import * as authActions from './actions';
import * as validators from './validator';
import { fetchAuth } from './index';


function executeFetchAuth() {
  return fetchAuth()
    .then(user => ({ user }))
    .catch(error => ({ error }));
}

function* signUp(inputs) {
  const errors = validators.validateSignUp(inputs);
  if (!errors.isEmpty()) {
    yield put(authActions.signUpValidationFailed(errors));
    return;
  }
  try {
    const user = yield call(
      [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
      inputs.email, inputs.password);
    user.sendEmailVerification();
    firebaseDB.ref(`users/${user.uid}`).set({
      companyName: inputs.companyName,
      fullName: inputs.fullName,
    });
    yield put(authActions.signUpFulfilled(user));
    // const { user } = yield executeFetchAuth();
    yield history.replace('/email-verification');
  } catch (e) {
    const signUpError = firebaseErrors[e.code];
    yield put(authActions.signUpFailed(signUpError));
  }
}

function* signUpWithGoogle(inputs) {
  const errors = validators.validateSignUp(inputs);
  if (!errors.isEmpty()) {
    yield put(authActions.signUpValidationFailed(errors));
    return;
  }
  const user = firebaseAuth.currentUser;
  firebaseDB.ref(`users/${user.uid}`).set({
    companyName: inputs.companyName,
    fullName: inputs.fullName,
  });
  yield put(authActions.signUpFulfilled(user));
  yield history.replace('/');
}

function* signUpWithGithub(inputs) {
  const errors = validators.validateSignUp(inputs);
  if (!errors.isEmpty()) {
    yield put(authActions.signUpValidationFailed(errors));
    return;
  }
  const user = firebaseAuth.currentUser;
  firebaseDB.ref(`users/${user.uid}`).set({
    companyName: inputs.companyName,
    fullName: inputs.fullName,
  });
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
      yield put(authActions.signInFulfilled(currentUser));
      yield history.replace('/');
      return;
    }
    yield put(authActions.finishConnectingToGoogleForSignUp(currentUser));
  } catch (e) {
    const signUpError = e.code ? firebaseErrors[e.code] : 'ログインに失敗しました';
    yield put(authActions.signUpFailed(signUpError));
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
      yield put(authActions.signInFulfilled(currentUser));
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
    yield put(authActions.signInFulfilled(user));
    yield history.replace('/');
  } catch (e) {
    console.log(e)
    const signInError = e.code ? firebaseErrors[e.code] : 'ログインに失敗しました';
    yield put(authActions.signInFailed(signInError));
  }
}

function* signInWithOAuth(provider) {
  try {
    const signInResult = yield call(
      [firebaseAuth, firebaseAuth.signInWithPopup], provider
    );
    const currentUser = signInResult.user;
    const { user } = yield call(executeFetchAuth);
    if (!user.userDataExists) {
      yield put(authActions.finishConnectingToGoogleForSignUp(currentUser));
      yield history.replace('/sign-up');
      return;
    }
    yield put(authActions.signInFulfilled(currentUser));
    yield history.replace('/');
  } catch (e) {
    console.log(e);
    const signInError = e.code ? firebaseErrors[e.code] : 'ログインに失敗しました';
    yield put(authActions.signInFailed(signInError));
  }
}

function* signOut() {
  try {
    yield call([firebaseAuth, firebaseAuth.signOut]);
    yield history.replace('/sign-in');
  } catch (e) {
    console.log(e);
  }
}

function* sendEmailVerification() {
  const user = firebaseAuth.currentUser;
  user.sendEmailVerification();
  yield put(authActions.emailVerificationSent());
}


function* finishEmailVerification() {
  // const { user /* , error */} = yield call(executeFetchAuth);
  try {
    yield call([firebaseAuth, firebaseAuth.signOut]);
    yield put(authActions.signOut());
    yield history.replace('/sign-in');
  } catch (e) {
    console.log(e);
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

function *watchFinishingEmailVerification() {
  while (true) {
    const { payload } = yield take(`${authActions.finishEmailVerification}`);
    yield fork(finishEmailVerification, payload);
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
  fork(watchFinishingEmailVerification),
];
