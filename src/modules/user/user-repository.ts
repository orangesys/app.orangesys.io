// @ts-nocheck
import { formatISO } from 'lib/dateUtils'
import SERVER_SETUP_STATUS from 'const/server-setup-status'
import { FirebaseAuth, FirebaseDB, FirebaseUser, FirebaseFactory } from 'lib/firebase'

type NewUserFields = {
  companyName: string
  fullName: string
}

export type ServerSetupData = {
  status: string
  startedAt?: string
  errorCode?: string
  errorMessage?: string
  updatedAt?: string
}

export default class UserRepository {
  auth: FirebaseAuth
  db: FirebaseDB

  constructor() {
    const firebase = FirebaseFactory.getInstance()
    this.auth = firebase.auth
    this.db = firebase.db
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    return await this.auth.createUserWithEmailAndPassword(email, password).then(({ user }) => user)
  }

  async addNewUserOnDB(uid: string, fields: NewUserFields): Promise<void> {
    const data = {
      companyName: fields.companyName,
      fullName: fields.fullName,
      createdAt: formatISO(new Date()),
    }
    return this.db.ref(`users/${uid}`).set(data)
  }

  async savePaymentInformation(
    uid: string,
    planId: string,
    retention: string,
    customerId: string,
    subscriptionId: string,
  ): Promise<void> {
    const key = `users/${uid}`
    const updates = {
      [`${key}/customerId`]: customerId,
      [`${key}/subscriptionId`]: subscriptionId,
      [`${key}/planId`]: planId,
      [`${key}/retention`]: retention,
      [`${key}/serverSetup/status`]: SERVER_SETUP_STATUS.NOT_STARTED,
      [`${key}/updatedAt`]: formatISO(new Date()),
    }
    await this.db.ref().update(updates)
  }

  async updateServerSetupStatus(uid: string, setupData: ServerSetupData): Promise<void> {
    const data = {
      updatedAt: formatISO(new Date()),
      ...setupData,
    }
    const key = `users/${uid}/serverSetup`
    const updates = {
      [`${key}/status`]: data.status,
      [`${key}/updatedAt`]: data.updatedAt,
    }
    if (data.startedAt) {
      updates[`${key}/startedAt`] = data.startedAt
    }
    if (data.errorCode) {
      updates[`${key}/errorCode`] = data.errorCode
    }
    if (data.errorMessage) {
      updates[`${key}/errorMessage`] = data.errorMessage
    }
    await this.db.ref().update(updates)
  }

  async saveApiSecrets(uid: string, consumerId: string, token: string, updatedAt: string = formatISO(new Date())) {
    const key = `users/${uid}`
    const updates = {
      [`${key}/telegraf/consumerId`]: consumerId,
      [`${key}/telegraf/token`]: token,
      [`${key}/updatedAt`]: updatedAt,
    }
    await this.db.ref().update(updates)
  }

  async updateProfile(uid: string, companyName: string, fullName: string, updatedAt: string = formatISO(new Date())) {
    const key = `users/${uid}`
    const updates = {
      [`${key}/companyName`]: companyName,
      [`${key}/fullName`]: fullName,
      [`${key}/updatedAt`]: updatedAt,
    }
    await this.db.ref().update(updates)
  }

  async reauthenticate(firebase: any, currentEmail: string, newEmail: string, password: string) {
    const credential = firebase?.auth?.EmailAuthProvider.credential(currentEmail, password)
    await this.auth?.currentUser?.reauthenticateWithCredential(credential)
  }

  async updateEmail(email: string): Promise<FirebaseUser> {
    await this.auth.currentUser?.updateEmail(email)
    return this.auth.currentUser
  }

  async fetchAuthUserFromAuth(): Promise<FirebaseUser | null> {
    const user = await this.getLogginedUser()
    if (user == null) {
      return null
    }
    return user
  }

  getLogginedUser(): Promise<FirebaseUser | null> {
    return new Promise(resolve => {
      const unsub = this.auth.onAuthStateChanged(user => {
        resolve(user)
        unsub()
      })
    })
  }

  async fetchFromDB(id: string) {
    const snapshot = await this.db.ref(`users/${id}`).once('value')
    return snapshot.val()
  }

  async applyActionCode(code: string) {
    await this.auth.applyActionCode(code)
  }

  async signInWithPopup(provider: any) {
    const result = await this.auth.signInWithPopup(provider)
    return result
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password)
  }

  async signOut() {
    await this.auth.signOut()
  }

  async sendPasswordResetEmail(email: string) {
    await this.auth.sendPasswordResetEmail(email)
  }

  async verifyPasswordResetCode(code: string): Promise<string> {
    const email = await this.auth.verifyPasswordResetCode(code)
    return email
  }

  async resetPassword(code: string, newPassword: string): Promise<void> {
    await this.auth.confirmPasswordReset(code, newPassword)
  }
}
