import { createReducer } from 'redux-act';
import { Record, Map, List } from 'immutable';
import { isEmpty } from 'lodash/lang';

import {
  initAuth,
  validateSignUp,
  changeSignUpField,
  serverSetupError,
  signUpValidationFailed,
  signUp,
  signUpFulfilled,
  signUpFailed,
  finishConnectingToGoogleForSignUp,
  finishConnectingToGithubForSignUp,
  setTelegraf,
  signIn,
  signInFulfilled,
  signInFailed,
  signOut,
  emailVerification,
  emailVerificationSent,
  emailChanged,
  verifyEmailFinished,
  verifyEmailFailed,
  verifyPasswordResetCode,
  verifyPasswordResetCodeFailed,
  verifyPasswordResetCodeFinished,
  resetPassword,
  resetPasswordFailed,
  resetPasswordFinished,
  goToSignUp,
  // goToSignIn,
  paymentFulfilled,
  putTelegraf,
  serverSetupFinished,
  clearMessage,
  showPasswordReset,
  cancelPasswordReset,
  sendPasswordResetMail,
  sendPasswordResetMailValidationFailed,
  sendPasswordResetMailFinished,
  sendPasswordResetMailFailed,
  recoverEmail,
  recoverEmailFailed,
  recoverEmailFinished,
} from './actions';
import * as validators from './validator';
import { SERVER_SETUP_STATUS } from 'src/core/server_setup';

const AuthState = new Record({
  authenticated: false,
  customerId: null,
  email: null,
  emailVerificationResult: 0,
  // verifying|verified|not_verified|resetting|errored|reset
  passwordResetStatus: null,
  targetEmail: null,
  needEmailVerification: false,
  companyName: null,
  fullName: null,
  planId: null,
  sendingVerificationEmail: false,
  sentVerificationEmail: false,
  serverSetup: new Map(),
  signInError: null,
  signingIn: false,
  signingUp: false,
  signingUpWithOAuth: false,
  signUpError: null,
  signUpFieldErrors: new Map(),
  signUpInputs: new Map({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
  }),
  signUpProvider: 'firebase',
  telegraf: new Map(),
  uid: null,
  showingPasswordReset: false,
  sendingPasswordResetMail: false,
  passwordResetErrors: new Map(),
  recoverEmailStatus: 0,
  providerData: new List(),
  errorMessage: null,
  message: null,
});

export const authReducer = createReducer({
  [initAuth]: (state, user) => {
    const u = user || {};
    return state.merge({
      authenticated: !isEmpty(u) && u.userDataExists,
      uid: u.uid,
      email: u.email,
      needEmailVerification: !u.emailVerified,
      companyName: u.companyName,
      fullName: u.fullName,
      planId: u.planId,
      sentVerificationEmail: false,
      serverSetup: u.serverSetup,
      telegraf: u.telegraf,
      providerData: new List(u.providerData),
    });
  },
  [changeSignUpField]: (state, input) => (
    state.merge({ signUpInputs: state.signUpInputs.merge(input) })
  ),
  [validateSignUp]: (state, inputs) => (
    state.merge({
      signUpFieldErrors: validators.validate(inputs),
    })
  ),
  [setTelegraf]: (state, telegraf) => (
    state.merge({ telegraf })
  ),
  [signUpValidationFailed]: (state, signUpFieldErrors) => (
    state.merge({
      signingUp: false,
      signUpFieldErrors,
    })
  ),
  [signUp]: (state) => (
    state.merge({
      signingUp: true,
    })
  ),
  [signUpFulfilled]: (state, user) => (
    state.merge({
      authenticated: true,
      signingUp: false,
      signUpFieldErrors: new Map(),
      signingUpWithOAuth: false,
      needEmailVerification: user.providerId === 'firebase' && !user.emailVerified,
      companyName: user.companyName,
      fullName: user.fullName,
      uid: user.uid,
      email: user.email,
      planId: user.planId,
      providerData: new List(user.providerData),
    })
  ),
  [finishConnectingToGoogleForSignUp]: (state, user) => (
    state.merge({
      signingUpWithOAuth: true,
      signUpProvider: 'google',
      signUpInputs: state.signUpInputs.merge({
        companyName: '',
        fullName: user.displayName,
        email: user.email,
        password: '',
      }),
    })
  ),
  [finishConnectingToGithubForSignUp]: (state, user) => (
    state.merge({
      signingUpWithOAuth: true,
      signUpProvider: 'github',
      signUpInputs: state.signUpInputs.merge({
        companyName: '',
        fullName: '',
        email: user.email,
        password: '',
      }),
    })
  ),
  [putTelegraf]: (state, telegraf) => (
    state.merge({ telegraf })
  ),
  [signInFulfilled]: (state, user) => {
    const u = user || {};
    return state.merge({
      authenticated: true,
      uid: u.uid,
      email: u.email,
      needEmailVerification: u.providerId === 'firebase' && !u.emailVerified,
      companyName: u.companyName,
      fullName: u.fullName,
      planId: u.planId,
      customerId: u.customerId,
      sentVerificationEmail: false,
      serverSetup: u.serverSetup,
      signingIn: false,
      telegraf: u.telegraf,
      providerData: new List(u.providerData),
    });
  },
  [signUpFailed]: (state, signUpError) => (
    state.merge({
      signingUp: false,
      signUpFieldErrors: new Map({ email: signUpError }),
    })
  ),
  [signIn]: (state) => (
    state.merge({
      signingIn: true,
    })
  ),
  [signInFailed]: (state, signInError) => (
    state.merge({
      signingIn: false,
      signInError,
    })
  ),
  [signOut]: (state) => (
    state.merge({ authenticated: false })
  ),
  [emailVerification]: (state) => (
    state.merge({ sendingVerificationEmail: true })
  ),
  [emailVerificationSent]: (state) => (
    state.merge({
      sendingVerificationEmail: false,
      sentVerificationEmail: true,
    })
  ),
  [verifyEmailFinished]: (state) => (
    state.merge({
      emailVerificationResult: 1,
    })
  ),
  [verifyEmailFailed]: (state) => (
    state.merge({
      emailVerificationResult: -1,
    })
  ),
  [goToSignUp]: (state) => (
    state.merge({
      signUpInputs: new Map({
        companyName: '',
        fullName: '',
        email: '',
        password: '',
      }),
    })
  ),
  [paymentFulfilled]: (state, { customerId, planId }) => (
    state.merge({
      customerId,
      planId,
      serverSetup: {
        status: SERVER_SETUP_STATUS.WAIT_STARTING,
      },
    })
  ),
  [serverSetupError]: (state, { errorCode }) => (
    state.merge({
      serverSetup: {
        status: SERVER_SETUP_STATUS.ERRORED,
        errorCode,
      },
    })
  ),
  [serverSetupFinished]: (state) => (
    state.merge({
      serverSetup: { status: SERVER_SETUP_STATUS.COMPLETED },
    })
  ),
  [clearMessage]: (state) => (
    state.merge({
      signInError: null,
      signUpError: null,
      message: null,
      errorMessage: null,
    })
  ),
  [showPasswordReset]: (state) => (
    state.merge({ showingPasswordReset: true })
  ),
  [cancelPasswordReset]: (state) => (
    state.merge({
      showingPasswordReset: false,
      passwordResetErrors: new Map(),
    })
  ),
  [sendPasswordResetMail]: (state) => (
    state.merge({ sendingPasswordResetMail: false })
  ),
  [sendPasswordResetMailValidationFailed]: (state, errors) => (
    state.merge({
      passwordResetErrors: errors,
    })
  ),
  [sendPasswordResetMailFailed]: (state) => (
    state.merge({
      message: 'パスワードを送信しました。メールを確認してください。',
      showingPasswordReset: false,
      sendingPasswordResetMail: false,
      passwordResetErrors: new Map(),
    })
  ),
  [sendPasswordResetMailFinished]: (state) => (
    state.merge({
      message: 'パスワードを送信しました。メールを確認してください。',
      showingPasswordReset: false,
      sendingPasswordResetMail: false,
      passwordResetErrors: new Map(),
    })
  ),
  [verifyPasswordResetCode]: (state) => (
    state.merge({ passwordResetStatus: 'verifying' })
  ),
  [verifyPasswordResetCodeFailed]: (state) => (
    state.merge({ passwordResetStatus: 'not_verified' })
  ),
  [verifyPasswordResetCodeFinished]: (state, targetEmail) => (
    state.merge({
      passwordResetStatus: 'verified',
      targetEmail,
    })
  ),
  [resetPassword]: (state) => (
    state.merge({ passwordResetStatus: 'resetting' })
  ),
  [resetPasswordFailed]: (state, errors) => (
    state.merge({
      passwordResetStatus: 'errored',
      passwordResetErrors: new Map(errors),
    })
  ),
  [resetPasswordFinished]: (state) => (
    state.merge({
      passwordResetErrors: new Map(),
      passwordResetStatus: 'reset',
    })
  ),
  [emailChanged]: (state, email) => (
    state.merge({
      email,
    })
  ),
  [recoverEmail]: (state) => (
    state.merge({ recoverEmailStatus: 1 })
  ),
  [recoverEmailFailed]: (state) => (
    state.merge({ recoverEmailStatus: 9 })
  ),
  [recoverEmailFinished]: (state, { email }) => (
    state.merge({
      recoverEmailStatus: 2,
      email,
    })
  ),
}, new AuthState());
