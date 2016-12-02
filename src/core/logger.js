/* eslint-disable no-console */
import { sendError } from './sentry';

export const logException = (e, context) => {
  sendError(e, context);
  console.error(e);
};
