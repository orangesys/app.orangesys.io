import { createAction } from 'redux-act';

export const clearMessage = createAction('clearMessage (settings)');
export const updateProfile = createAction('update profile (settings)');
export const updateProfileValidationFailed = createAction('update profile validation failed');
export const updateProfileFailed = createAction('update profile failed');
export const updateProfileSucceeded = createAction('update profile succeeded');
