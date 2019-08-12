import { Container } from 'aurelia-framework'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import environment from 'environment'
import { AuthUiService } from 'services/firebase/auth-ui'
import { AuthService } from 'services/firebase/auth'

export const registerDependencies = (c: Container): void => {
  const firebaseApp = firebase.initializeApp(environment.firebaseConfig)
  const auth = firebaseApp.auth()
  const ui = new firebaseui.auth.AuthUI(auth)

  c.registerInstance(AuthService, new AuthService(auth))
  c.registerInstance(AuthUiService, new AuthUiService(ui))
}
