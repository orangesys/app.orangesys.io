// @ts-nocheck
import firebase from 'firebase'
import { error } from 'lib/utils'
import { plans, PlanIdType } from 'modules/plan/plans'
import User from './user'
import UserFactory from './user-factory'
import UserRepository from './user-repository'

import { ProviderId } from './user'
import { ServerSetupData } from './user-repository'

export type NewUserFields = {
  companyName: string
  fullName: string
}

export class UserService {
  repository: UserRepository

  constructor() {
    const repository = new UserRepository()
    this.repository = repository
  }

  generateProvider(providerId: ProviderId): any {
    if (providerId === 'google.com') {
      return new firebase.auth.GoogleAuthProvider()
    }
    if (providerId === 'github.com') {
      return new firebase.auth.GithubAuthProvider()
    }
    return undefined
  }

  async fetchUser(): Promise<User> {
    const auth = await this.repository.fetchAuthUserFromAuth()
    if (auth === null) {
      return new User()
    }
    const db = await this.repository.fetchFromDB(auth.uid)
    return UserFactory.createFromObject({ auth, db })
  }

  async createUserWithEmailAndPassword(email: string, password: string, newUserFields: NewUserFields): Promise<User> {
    const authUser = await this.repository.createUserWithEmailAndPassword(email, password)
    authUser.sendEmailVerification()
    await this.repository.addNewUserOnDB(authUser.uid, newUserFields)
    return this.createFromObject(newUserFields, authUser)
  }

  async createUserWithOAuth(newUserFields: NewUserFields): Promise<User> {
    const authUser = await this.repository.fetchAuthUserFromAuth()
    if (authUser == null) {
      throw new Error("auth doesn't exist")
    }
    const db = await this.repository.fetchFromDB(authUser.uid)
    if (db != null) {
      throw error.generateError('user already exists', 'custom-auth/user-already-exists')
    }
    await this.repository.addNewUserOnDB(authUser.uid, newUserFields)
    return this.createFromObject(newUserFields, authUser)
  }

  async signInWithOAuth(providerId: ProviderId): Promise<User> {
    await this.repository.signInWithPopup(providerId)
    const user = await this.fetchUser()
    return user
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await this.repository.signInWithEmailAndPassword(email, password)
    const user = await this.fetchUser()
    return user
  }

  async signOut() {
    await this.repository.signOut()
  }

  createFromObject(db: UserDB, auth: any) {
    return UserFactory.createFromObject({ db, auth })
  }

  async applyActionCode(code: string): Promise<User> {
    await this.repository.applyActionCode(code)
    return await this.fetchUser()
  }

  async savePaymentInformation(
    uid: string,
    planId: PlanIdType,
    customerId: string,
    subscriptionId: string,
  ): Promise<User> {
    const plan = plans.get(planId)
    if (plan == null) {
      throw new Error('plan is null')
    }
    await this.repository.savePaymentInformation(uid, planId, plan.retention, customerId, subscriptionId)
    return await this.fetchUser()
  }

  async updateServerSetupStatus(uid: string, data: ServerSetupData): Promise<User> {
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
