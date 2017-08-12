// @flow

import User from './user'
import UserFactory from './user-factory'
import UserRepository from './user-repository'
import { error } from '../lib/utils'
import plans from './plans'
import type { PlanId } from './plans'
import type { DB as UserDB, ProviderId } from './user'
import type { ServerSetupData } from './user-repository'

export type NewUserFields = UserDB

export default class UserService {
  repository: UserRepository
  factory: typeof UserFactory

  constructor(repository: UserRepository, factory: typeof UserFactory) {
    this.repository = repository
    this.factory = factory
  }

  static generateProvider(firebase: any, providerId: ProviderId): any {
    const mapping = {
      'google.com': firebase.auth.GoogleAuthProvider,
      'github.com': firebase.auth.GithubAuthProvider,
    }
    return new mapping[providerId]()
  }

  async fetchUser(): Promise<User> {
    const auth = await this.repository.fetchFromAuth()
    if (auth == null) { return new User() }
    const db = await this.repository.fetchFromDB(auth.uid)
    return this.factory.createFromObject({ auth, db })
  }

  async createUserWithPassword(
    password: string, newUserFields: Object,
  ): Promise<User> {
    const { email } = newUserFields
    const authUser = await this.repository.createUserWithPassword(email, password)
    authUser.sendEmailVerification()
    await this.repository.addNewUserOnDB(authUser.uid, newUserFields)
    return this.createFromObject(newUserFields, authUser)
  }

  async createUserWithOAuth(newUserFields: NewUserFields): Promise<User> {
    const authUser = await this.repository.fetchFromAuth()
    if (authUser == null) { throw new Error("auth doesn't exist") }
    if (!authUser.emailVerified) {
      authUser.sendEmailVerification()
    }
    const db = await this.repository.fetchFromDB(authUser.uid)
    if (db != null) {
      throw error.generateError('user already exists', 'custom-auth/user-already-exists')
    }
    await this.repository.addNewUserOnDB(authUser.uid, newUserFields)
    return this.createFromObject(newUserFields, authUser)
  }

  async signInWithOAuth(providerId: ProviderId): Promise<?User> {
    await this.repository.signInWithPopup(providerId)
    const user = await this.fetchUser()
    return user
  }

  async signInWithPassword(email: string, password: string) {
    await this.repository.signInWithPassword(email, password)
    const user = await this.fetchUser()
    return user
  }

  createFromObject(db: UserDB, auth: any) {
    return this.factory.createFromObject({ db, auth })
  }

  async applyActionCode(code: string): Promise<User> {
    await this.repository.applyActionCode(code)
    return await this.fetchUser()
  }

  async savePaymentInformation(
    uid: string, planId: PlanId, customerId: string, subscriptionId: string,
  ): Promise<User> {
    const plan = plans.get(planId)
    if (plan == null) { throw new Error('plan is null') }
    await this.repository.savePaymentInformation(
      uid, planId, plan.retention, customerId, subscriptionId)
    return await this.fetchUser()
  }

  async updateServerSetupStatus(
    uid: string,
    data: ServerSetupData,
  ): Promise<User> {
    await this.repository.updateServerSetupStatus(uid, data)
    return await this.fetchUser()
  }

  async updateProfile(uid: string, companyName: string, fullName: string): Promise<User> {
    await this.repository.updateProfile(uid, companyName, fullName)
    return await this.fetchUser()
  }

  async changeEmail(firebase: any, user: User, email: string, password: string): Promise<User> {
    await this.repository.reauthenticate(firebase, user.getEmail(), email, password)
    // update email
    const firebaseUser = await this.repository.updateEmail(email)
    firebaseUser.sendEmailVerification()
    return await this.fetchUser()
  }

  async sendPasswordResetEmail(email: string) {
    await this.repository.sendPasswordResetEmail(email)
  }
}
