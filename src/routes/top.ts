import { autoinject } from 'aurelia-framework'
import { AuthService } from 'services/firebase/auth'
import { AuthUiService } from 'services/firebase/auth-ui'

@autoinject
export class Top {
  constructor(private auth: AuthService, private authUi: AuthUiService) {}

  attached(): void {
    this.authUi.render('#firebaseui-auth-container')
  }
}
