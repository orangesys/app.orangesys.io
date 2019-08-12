import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'

@autoinject
export class AuthService {
  private readonly logger = getLogger(AuthService.name)

  public isSignedIn = false

  constructor(public auth: firebase.auth.Auth) {}
}
