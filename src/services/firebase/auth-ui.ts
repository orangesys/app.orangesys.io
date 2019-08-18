import { autoinject } from 'aurelia-framework'
import * as firebase from 'firebase/app'
import 'firebase/auth'

enum SignInFlow {
  POPUP = 'popup',
  REDIRECT = 'redirect',
}

@autoinject
export class AuthUiService {
  // https://github.com/firebase/firebaseui-web#configuration
  private readonly config: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: (): boolean => {
        return false
      },
    },
    signInFlow: SignInFlow.POPUP,
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
  }

  constructor(private ui: firebaseui.auth.AuthUI) {}

  public render(elementId: string): void {
    this.ui.start(elementId, this.config)
  }
}
