import { bindable, autoinject } from 'aurelia-framework'
import { AuthUiService } from 'services/firebase/auth-ui'

@autoinject
export class SnsSignIn {
  @bindable action: string

  constructor(private authUi: AuthUiService) {}

  attached(): void {
    this.authUi.render('#sns-auth-container')
  }
}
