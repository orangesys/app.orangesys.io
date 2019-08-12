import { autoinject } from 'aurelia-framework'
import { AuthService } from 'services/firebase/auth'
import { NavigationInstruction, Next } from 'aurelia-router'
import { getLogger } from 'aurelia-logging'

@autoinject
export class AuthorizeStep {
  private readonly logger = getLogger(AuthService.name)

  constructor(private auth: AuthService) {}

  run(instruction: NavigationInstruction, next: Next): Promise<void> {
    this.logger.debug('Current User:', this.auth.auth.currentUser)

    return next()
  }
}
