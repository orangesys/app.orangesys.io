import { createAction } from 'redux-act';

export const initAuth = createAction('init auth');
export const changeSignUpField = createAction('change sign up field');
export const validateSignUp = createAction('validate sign-up');
export const startSigningUpWithGoogle = createAction('start signing up with google');
export const startSigningUpWithGithub = createAction('start signing up with github');
export const finishConnectingToGoogleForSignUp =
  createAction('finish connecting to google for sign up');
export const finishConnectingToGithubForSignUp =
  createAction('finish connecting to github for sign up');
export const signUp = createAction('sign up');
export const signUpWithGoogle = createAction('sign up with google');
export const signUpWithGithub = createAction('sign up with github');
export const signUpValidationFailed = createAction('sign-up validation failed');
export const signUpFailed = createAction('sign-up failed');
export const signUpFulfilled = createAction('sign up fulfilled');
export const signingUpWithGoogle = createAction('signing up with google');
export const signingUpWithGithub = createAction('signing up with github');
export const signIn = createAction('sign in');
export const signInWithGoogle = createAction('sign in with google');
export const signInWithGithub = createAction('sign in with github');
export const signInFulfilled = createAction('sign in fulfilled');
export const signInFailed = createAction('sign-in failed');
export const signOut = createAction('sign out');
export const emailVerification = createAction('send email verification');
export const emailVerificationSent = createAction('verification email sent');
export const finishEmailVerification = createAction('finish email verification');
export const goToSignUp = createAction('go to sign up');
export const goToSignIn = createAction('go to sign in');
