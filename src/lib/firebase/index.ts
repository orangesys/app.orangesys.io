import firebase from 'firebase'
import { authErrors } from './errors'

export type Config = {
  apiKey: string
  authDomain: string
  databaseURL: string
  storageBucket: string
}

export const defaultConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
}

export type FirebaseAuth = firebase.auth.Auth
export type FirebaseUser = firebase.User

export type FirebaseDB = firebase.database.Database

let instance: any = null

class Firebase {
  app: firebase.app.App

  constructor(app: firebase.app.App) {
    this.app = app
  }

  get auth(): firebase.auth.Auth {
    return this.app.auth()
  }
  get db(): firebase.database.Database {
    return this.app.database()
  }
  static root() {
    return firebase
  }
}

export class FirebaseFactory {
  static getInstance(_firebase: any = firebase, config: Config = defaultConfig): Firebase {
    if (instance) {
      return instance
    }
    const app = _firebase.initializeApp(config)
    instance = new Firebase(app)
    return instance
  }
}

export { authErrors }
