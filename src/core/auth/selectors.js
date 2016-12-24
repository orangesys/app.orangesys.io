import { getLocation } from 'src/core/selectors';
import { needServerSetup } from 'src/core/server_setup';

export function getAuth(state) {
  return state.auth;
}

export function needEmailVerification(state) {
  return getAuth(state).needEmailVerification;
}

export function getUid(state) {
  return getAuth(state).uid;
}

export function getFieldsForPayment(state) {
  const auth = getAuth(state);
  return {
    uid: auth.uid,
    email: auth.email,
  };
}

export function getPlanId(state) {
  const auth = getAuth(state);
  return auth.planId;
}

export function needSetupPlan(state) {
  return !getPlanId(state);
}

export function getTelegraf(state) {
  return getAuth(state).telegraf.toJS();
}

export function getEmailVerification(state) {
  const auth = getAuth(state);
  return {
    sendingVerificationEmail: auth.sendingVerificationEmail,
    sentVerificationEmail: auth.sentVerificationEmail,
  };
}

export function getEmailVerificationParams(state, ownProps) {
  const query = getLocation(state, ownProps).query;
  return {
    apiKey: query.apiKey,
    mode: query.mode,
    oobCode: query.oobCode,
  };
}

export function getEmailVerificationResult(state) {
  const auth = getAuth(state);
  return auth.emailVerificationResult;
}

export function isAuthenticated(state) {
  return getAuth(state).authenticated;
}

export function getSignUp(state) {
  const auth = getAuth(state);
  return {
    inputs: auth.signUpInputs,
    signingUp: auth.signingUp,
    signUpFieldErrors: auth.signUpFieldErrors,
    signingUpWithOAuth: auth.signingUpWithOAuth,
    signUpProvider: auth.signUpProvider,
  };
}

export function getSignIn(state) {
  const auth = getAuth(state);
  return {
    signingIn: auth.signingIn,
    signInError: auth.signInError,
  };
}

export function getServerSetup(state) {
  const severSetup = getAuth(state).serverSetup;
  if (!severSetup) {
    return {};
  }
  return severSetup.toJS();
}

export function getServerSetupStatus(state) {
  return getServerSetup(state).status;
}

export function isNeedServerSetup(state) {
  const status = getServerSetupStatus(state);
  return needServerSetup(status);
}

export function getProfile(state) {
  const auth = getAuth(state);
  return {
    companyName: auth.get('companyName'),
    fullName: auth.get('fullName'),
  };
}
