/* eslint-disable no-undef */
import Raven from 'raven-js';
import ravenMiddleware from 'redux-raven-middleware';

export const config = {
  DSN: SENTRY_DSN,
};

Raven.config(config.DSN).install();

export const isSentryConfigActive = !!config.DSN;

export const sendError = (e, context) => {
  if (isSentryConfigActive) {
    Raven.captureException(e, { extra: context });
  }
};

export const generateRavenMiddleware = () => (
  ravenMiddleware(config.DSN)
);
