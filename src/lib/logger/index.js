// @flow
/* eslint-disable no-console */
import * as sentry from './sentry'

export { sentry }

export const logException = (e: Error, context?: any): void => {
  sentry.sendError(e, context)
  console.error(e)
}
