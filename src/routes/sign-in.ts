import { autoinject } from 'aurelia-framework'
import { AuthService } from 'services/firebase/auth'
import { getLogger } from 'aurelia-logging'
import { EventAggregator, Subscription } from 'aurelia-event-aggregator'
import { EventType } from 'event-type'
import { Router } from 'aurelia-router'

@autoinject
export class SignIn {
  private readonly logger = getLogger(SignIn.name)

  private uid: string
  private email: string
  private password: string

  private authStateChangeSubsc: Subscription

  constructor(private auth: AuthService, private router: Router, private ea: EventAggregator) {}

  attached(): void {
    this.authStateChangeSubsc = this.ea.subscribe(EventType.AUTH_STATE_CHANGED, this.forwardToTop)
  }

  detached(): void {
    this.authStateChangeSubsc.dispose()
  }

  async save(): Promise<void> {
    if (!(this.email && this.password)) {
      alert('error')
      return
    }

    try {
      const userCred = await this.auth.auth.signInWithEmailAndPassword(this.email, this.password)
    } catch (err) {
      this.logger.error(`failed to sign-in:`, err)
    }
  }

  forwardToTop = (user: firebase.User): void => {
    this.logger.debug('forward to top', user)
    if (user) {
      this.router.navigateToRoute('setup-plan')
    }
  }
}
