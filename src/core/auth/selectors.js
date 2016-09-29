export function getAuth(state) {
  return state.auth;
}

export function needEmailVerification(state) {
  return getAuth(state).needEmailVerification;
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
  console.log("selector data:", data)
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
