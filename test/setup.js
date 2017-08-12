/* eslint-disable */
import 'babel-polyfill'

[
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_STORAGE_BUCKET',
  'STRIPE_PUBLISHABLE_KEY',
  'PAYMENT_API_ENDPOINT',
  'ORANGESYS_API_ENDPOINT',
  'API_DEBUG_MODE',
  'SENTRY_DSN',
  'SUPPORT_EMAIL',
].forEach((envName) => {
  global[envName] = process.env[envName]
})

global.window = {}

global.window.Stripe = { setPublishableKey: () => {} }
