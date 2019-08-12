/* eslint-disable prettier/prettier */
import { autoinject, PLATFORM } from 'aurelia-framework'
import { AuthService } from 'services/firebase/auth'
import { RouterConfiguration, Router } from 'aurelia-router'
import { AuthorizeStep } from 'authorize-step'

@autoinject
export class App {
  router: Router

  constructor(private auth: AuthService) {}

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = 'Aurelia Scaffold App'

    config.options.pushState = true
    config.options.root = '/'

    config.addAuthorizeStep(AuthorizeStep)

    config.map([
      { route: '', name: 'top', moduleId: PLATFORM.moduleName('routes/top'), title: 'Top Page' },
    ])

    this.router = router
  }
}
