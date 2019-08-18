import { EventAggregator } from 'aurelia-event-aggregator'
import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import { User } from 'entities/user'
import { EventType } from 'event-type'
import environment from 'environment'
import { FirestoreService } from './firestore'

export interface AuthError {
  code: string
  message: string
}

@autoinject
export class AuthService {
  private readonly logger = getLogger(AuthService.name)

  public isSignedIn = false
  public isVerified = false
  public user: User | null

  constructor(
    public auth: firebase.auth.Auth,
    private store: FirestoreService,
    private ea: EventAggregator,
  ) {}

  publishAuthStateChanged = (user: firebase.User): void => {
    this.ea.publish(EventType.AUTH_STATE_CHANGED, user)
  }

  public onAuthStateChanged = async (user: firebase.User): Promise<void> => {
    this.logger.info('authStateChanged', user)

    if (!user) {
      this.isSignedIn = false
      this.user = null
      return
    }
    this.isSignedIn = true
    this.user = await this.store.getUser(user.uid)
    this.isVerified = !!this.user

    this.publishAuthStateChanged(user)
  }

  async sendEmailVerification(): Promise<void> {
    const actionConfig: firebase.auth.ActionCodeSettings = {
      url: `${environment.emailVerification.redirectDomain}/setup/plan`,
      handleCodeInApp: false,
    }
    return this.auth.currentUser.sendEmailVerification(actionConfig)
  }
}
