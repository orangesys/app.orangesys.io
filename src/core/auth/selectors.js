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
    id: auth.uid,
    email: auth.email,
  };
}

export function needSetupPlan(state) {
  const auth = getAuth(state);
  return !auth.planId;
}

export function getEmailVerification(state) {
  const auth = getAuth(state);
  return {
    sendingVerificationEmail: auth.sendingVerificationEmail,
    sentVerificationEmail: auth.sentVerificationEmail,
  };
}

export function isAuthenticated(state) {
  return getAuth(state).authenticated;
}

export function getSignUp(state) {
  const auth = getAuth(state);
  let data = {
    inputs: auth.signUpInputs,
    signingUp: auth.signingUp,
    signUpFieldErrors: auth.signUpFieldErrors,
    signingUpWithOAuth: auth.signingUpWithOAuth,
    signUpProvider: auth.signUpProvider,
  };
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
