/* eslint-disable prettier/prettier */
import { autoinject, PLATFORM } from 'aurelia-framework'
import { AuthService } from 'services/firebase/auth'
import { RouterConfiguration, Router } from 'aurelia-router'
import { AuthorizeStep } from 'authorize-step'

// import '@material/textfield/mdc-text-field.scss'
// import '@material/textfield/helper-text/mdc-text-field-helper-text.scss'
// import '@material/line-ripple/mdc-line-ripple.scss'
// import '@material/notched-outline/mdc-notched-outline.scss'
// import '@material/floating-label/mdc-floating-label.scss'
// import '@material/button/mdc-button.scss'
// import '@material/card/mdc-card.scss'
// import '@material/typography/mdc-typography.scss'

@autoinject
export class App {
  router: Router

  constructor(private auth: AuthService) {}

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = 'Orangesys'

    config.options.pushState = true
    config.options.root = '/'

    config.addAuthorizeStep(AuthorizeStep)
    config.fallbackRoute('')

    config.map([
      { route: '', name: 'top', moduleId: PLATFORM.moduleName('routes/top'), title: 'Top Page' },
      { route: 'sign-in', name: 'sign-in', moduleId: PLATFORM.moduleName('routes/sign-in'), title: 'Sign In' },
      { route: 'sign-up', name: 'sign-up', moduleId: PLATFORM.moduleName('routes/sign-up'), title: 'Sign Up' },
      { route: 'setup/verification-guide', name: 'verification-guide', moduleId: PLATFORM.moduleName('routes/setup/verification-guide'), title: 'Email Verification' },
      { route: 'setup/plan', name: 'setup-plan', moduleId: PLATFORM.moduleName('routes/setup/setup-plan'), title: 'Setup Plan' },
      { route: 'setup/payment', name: 'setup-payment', moduleId: PLATFORM.moduleName('routes/setup/setup-payment'), title: 'Setup Payment' },
      // { route: '', name: '', moduleId: PLATFORM.moduleName('routes/'), title: '' },
    ])

    this.router = router
  }

  signOut(): Promise<void> {
    return this.auth.auth.signOut()
  }
}
