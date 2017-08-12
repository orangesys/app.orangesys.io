// @flow
/* eslint-disable no-undef */
import Raven from 'raven-js'
import ravenMiddleware from 'redux-raven-middleware'
import config from './sentry-config'

Raven.config(config.DSN).install()

export const isSentryConfigActive: boolean = !!config.DSN

export const sendError = (e: Error, context: any): void => {
  if (isSentryConfigActive) {
    Raven.captureException(e, { extra: context })
  }
}

export const generateRavenMiddleware = () => (
  ravenMiddleware(config.DSN)
)
