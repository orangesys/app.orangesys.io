import { createAction } from 'redux-act';

export const clearMessage = createAction('clearMessage (settings)');
export const updateProfile = createAction('update profile (settings)');
export const updateProfileValidationFailed = createAction('update profile validation failed');
export const updateProfileFailed = createAction('update profile failed');
export const updateProfileSucceeded = createAction('update profile succeeded');

export const showEmailChange = createAction('show email change');
export const cancelEmailChange = createAction('cancel email change');
export const changeEmail = createAction('change email');
export const changeEmailFinished = createAction('change email finished');
export const changeEmailValidationFailed = createAction('change email validation failed');
export const changeEmailFailed = createAction('change email failed');

export const changeCreditCardField = createAction('change credit card field')
export const startChangingCreditCard = createAction('start changing credit card');
export const changeCreditCard = createAction('change credit card');
export const changeCreditCardFailed = createAction('change credit card failed');
export const changeCreditCardFinished = createAction('change credit card finished');
export const stripeTokenGenerationError = createAction('stripe token generation error');
