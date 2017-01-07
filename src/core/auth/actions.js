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
export const serverSetupError = createAction('server setup error');
export const serverSetupFinished = createAction('server setup finished');
export const setTelegraf = createAction('set telegraf');
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
export const verifyEmail = createAction('verify email');
export const verifyEmailFailed = createAction('verify email failed');
export const verifyEmailFinished = createAction('verify email finished');
export const verifyPasswordResetCode = createAction('verify password reset code');
export const verifyPasswordResetCodeFailed = createAction('verify password reset code failed');
export const verifyPasswordResetCodeFinished = createAction('verify password reset code finished');
export const resetPassword = createAction('reset password');
export const resetPasswordFailed = createAction('reset password failed');
export const resetPasswordFinished = createAction('reset password finished');

export const goToSignUp = createAction('go to sign up');
export const goToSignIn = createAction('go to sign in');
export const paymentFulfilled = createAction('payment fulfilled');
export const putTelegraf = createAction('put telegraf');
export const clearMessage = createAction('clear message');
export const updateProfile = createAction('update profile (auth)');
export const showPasswordReset = createAction('show password reset');
export const cancelPasswordReset = createAction('cancel password reset');
export const sendPasswordResetMail = createAction('send password reset mail');
export const sendPasswordResetMailFinished = createAction('send password reset mail finished');
export const sendPasswordResetMailValidationFailed =
  createAction('send password reset mail validation failed');
export const sendPasswordResetMailFailed = createAction('send password reset mail failed');
