// @flow
import firebase from 'firebase'
import defaultConfig from './config'
import type { Config } from './config'

export type FirebaseAuth = firebase.auth.Auth
export type FirebaseUser = firebase.auth.User
export type FirebaseDB = firebase.database.Database

let instance = null

export default class Firebase {
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
  static getInstance(_firebase: firebase = firebase, config: Config = defaultConfig): Firebase {
    if (instance) { return instance }
    const app = _firebase.initializeApp(config)
    instance = new Firebase(app)
    return instance
  }
}

export function initializeApp(_firebase: firebase = firebase, config: Config = defaultConfig) {
  FirebaseFactory.getInstance(_firebase, config)
}
