import { Aurelia, PLATFORM } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import environment from 'environment'
import { registerDependencies } from 'register'
import { AuthService } from 'services/firebase/auth'

export function configure(aurelia: Aurelia): void {
  aurelia.use.standardConfiguration().feature(PLATFORM.moduleName('resources/index'))

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn')

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'))
  }

  registerDependencies(aurelia.container)

  aurelia.start().then((): void => {
    const auth = aurelia.container.get(AuthService) as AuthService
    const router = aurelia.container.get(Router) as Router

    auth.auth.onAuthStateChanged(
      async (user): Promise<void> => {
        if (!router.isConfigured) {
          await aurelia.setRoot()
          aurelia.setRoot(PLATFORM.moduleName('app'))
        }

        if (user) {
          auth.isSignedIn = true
        } else {
          auth.isSignedIn = false
        }
      },
    )
  })
}
