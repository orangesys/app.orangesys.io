import { EventAggregator, Subscription } from 'aurelia-event-aggregator'
import { autoinject, computedFrom } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import { ValidationController, ValidationControllerFactory } from 'aurelia-validation'
import { EventType } from 'event-type'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { AuthService } from 'services/firebase/auth'
import { FirestoreService } from 'services/firebase/firestore'
import { NavigationInstruction, RouterConfiguration, RouteConfig, Router } from 'aurelia-router'

export enum SignUpType {
  EMAIL = 'メールアドレス',
  GOOGLE = 'Googleアカウント',
  GITHUB = 'GitHubアカウント',
}

@autoinject
export class SignUp {
  private readonly logger = getLogger(SignUp.name)

  signUpType = SignUpType.EMAIL
  private uid: string
  private email: string
  private password: string
  private company: string
  private fullName: string

  private controller: ValidationController
  private authStateChangedSubsc: Subscription

  constructor(
    private auth: AuthService,
    private router: Router,
    private ea: EventAggregator,
    private store: FirestoreService,
    private factory: ValidationControllerFactory,
  ) {
    this.controller = factory.createForCurrentScope()
    this.authStateChangedSubsc = this.ea.subscribe(EventType.AUTH_STATE_CHANGED, this.switchSnsSignUp)
  }

  async canActivate(
    params: any,
    routeConfig: RouteConfig,
    navigationInstruction: NavigationInstruction,
  ): Promise<boolean> {
    if (!this.auth.isSignedIn) {
      return true
    }
    const { uid } = this.auth.auth.currentUser
    const user = await this.store.getUser(uid)
    if (user) {
      this.logger.warn('already signed up, redirect to top page', user)
      navigationInstruction.router.navigateToRoute('top')
      return false
    }
    return true
  }

  attached(): void {
    if (!this.auth.isSignedIn) return

    const user = this.auth.auth.currentUser
    switch (user.providerData[0].providerId) {
      case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
        this.switchSnsSignUp(user)
        break
      case firebase.auth.GithubAuthProvider.PROVIDER_ID:
        this.switchSnsSignUp(user)
        break
      default:
        this.signUpType = SignUpType.EMAIL
        break
    }
  }

  detached(): void {
    this.authStateChangedSubsc.dispose()
  }

  @computedFrom('signUpType')
  get isEmailSignUp(): boolean {
    return this.signUpType === SignUpType.EMAIL
  }

  @computedFrom('signUpType', 'email', 'password', 'company', 'fullName')
  get canSave(): boolean {
    if (this.signUpType === SignUpType.EMAIL) {
      return !!(this.email && this.password && this.company && this.fullName)
    }
    return !!(this.email && this.company)
  }

  async save(): Promise<void> {
    if (!this.canSave) {
      alert('error')
      return
    }

    if (this.signUpType === SignUpType.EMAIL) {
      if (!this.auth.isSignedIn) {
        try {
          const userCred = await this.auth.auth.createUserWithEmailAndPassword(this.email, this.password)
          this.logger.debug('user created:', userCred)
          this.uid = userCred.user.uid
        } catch (err) {
          this.logger.error(`failed to create user with email:`, err)
        }
      }
    } else {
      const user = this.auth.auth.currentUser
      this.uid = user.uid
      if (!user.emailVerified) {
        this.auth.auth.updateCurrentUser({ ...user, emailVerified: true }).then((): void => {
          this.logger.debug('update emailVerified successful')
        })
      }
    }

    try {
      await this.store.createUser(this.uid, this.email, this.fullName, this.company)
    } catch (err) {
      this.logger.error(`failed to create user:`, err)
    }

    this.router.navigateToRoute('setup-plan')
  }

  public switchSnsSignUp = async (user: firebase.User): Promise<void> => {
    this.logger.debug('Firebase user authenticated', user)
    if (!user) return

    this.email = user.email
    this.fullName = user.displayName

    switch (user.providerData[0].providerId) {
      case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
        this.signUpType = SignUpType.GOOGLE
        break
      case firebase.auth.GithubAuthProvider.PROVIDER_ID:
        this.signUpType = SignUpType.GITHUB
        break
      default:
        this.logger.error('unknown auth provider', user.providerData)
        break
    }
  }
}
