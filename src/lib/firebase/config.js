/* eslint-disable no-undef */

export type Config = {
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  storageBucket: string,
}

export default {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
}
