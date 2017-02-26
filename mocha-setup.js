/* eslint-disable */

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
].forEach((envName) => {
  global[envName] = process.env[envName]
})

global.window.Stripe = { setPublishableKey: () => {} }
