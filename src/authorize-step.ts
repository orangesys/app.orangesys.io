import { autoinject } from 'aurelia-framework'
import { AuthService } from 'services/firebase/auth'
import { NavigationInstruction, Next, Redirect } from 'aurelia-router'
import { getLogger } from 'aurelia-logging'

@autoinject
export class AuthorizeStep {
  private readonly logger = getLogger(AuthorizeStep.name)

  private noAuthedRoutes = ['sign-in', 'sign-up']
  private verificatonGuide = 'verification-guide'

  constructor(private auth: AuthService) {}

  run(instruction: NavigationInstruction, next: Next): Promise<any> {
    this.logger.debug('Current User:', this.auth.auth.currentUser)
    this.logger.debug(`isSignedIn: ${this.auth.isSignedIn}, isVerified: ${this.auth.isVerified}`)

    const routeName = instruction.config.name

    if (!this.auth.isSignedIn) {
      if (this.noAuthedRoutes.includes(routeName)) {
        return next()
      }
      this.logger.info('redirect to sign-in page')
      return next.cancel(new Redirect('sign-in'))
    }

    // if (!this.auth.isVerified) {
    //   if (routeName === this.noAuthedRoutes[1]) {
    //     return next()
    //   }
    //   this.logger.info('redirect to sign-up page')
    //   return next.cancel(new Redirect('sign-up'))
    // }

    if (!this.auth.auth.currentUser.emailVerified) {
      if (routeName === this.verificatonGuide) {
        return next()
      }
      this.logger.info('redirect to verification guide page')
      return next.cancel(new Redirect(`setup/${this.verificatonGuide}`))
    }

    if (routeName === this.verificatonGuide) {
      this.logger.info('redirect to setup page')
      return next.cancel(new Redirect(`setup/plan`))
    }

    // if (this.auth.isSignedIn && this.auth.isVerified) {
    //   if (this.noAuthedRoutes.includes(routeName)) {
    //     this.logger.info('redirect to top page')
    //     return next.cancel(new Redirect(''))
    //   }
    //   return next()
    // }

    return next()
  }
}
