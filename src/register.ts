import { Container } from 'aurelia-framework'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import * as firebaseui from 'firebaseui'
import environment from 'environment'
import { AuthUiService } from 'services/firebase/auth-ui'
import { AuthService } from 'services/firebase/auth'
import { FirestoreService } from 'services/firebase/firestore'
import { EventAggregator } from 'aurelia-event-aggregator'

export const registerDependencies = (c: Container): void => {
  const firebaseApp = firebase.initializeApp(environment.firebaseConfig)

  const store = new FirestoreService(firebaseApp.firestore())
  c.registerInstance(FirestoreService, store)

  const auth = firebaseApp.auth()
  auth.useDeviceLanguage()
  const ui = new firebaseui.auth.AuthUI(auth)
  const ea = new EventAggregator()
  c.registerInstance(EventAggregator, ea)

  c.registerInstance(AuthService, new AuthService(auth, store, ea))
  c.registerInstance(AuthUiService, new AuthUiService(ui))
}
