import { autoinject } from 'aurelia-framework'
import { auth } from 'firebase'

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
        return true
      },
    },
    signInFlow: SignInFlow.POPUP,
    signInSuccessUrl: '/',
    signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
  }

  constructor(private ui: firebaseui.auth.AuthUI) {}

  public render(elementId: string): void {
    this.ui.start(elementId, this.config)
  }
}
