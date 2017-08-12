// @flow
import SERVER_SETUP_STATUS from './server-setup-status'
import plans from './plans'
import type { PlanId, Plan } from './plans'

export type ServerSetupStatus = 'not-started' | 'building' | 'completed' | 'errored'

type ServerSetup = {
  status: ServerSetupStatus,
  startedAt?: string,
  completedAt?: string,
  errorCode?: string,
  pingErrors: {
    [key: string]: string,
  },
}

export type ApiSecrets = {
  consumerId: string,
  token: string,
}

export type DB = {
  companyName: string,
  createdAt: string,
  fullName: string,
  customerId?: string,
  planId?: ('small' | 'medium' | 'large'),
  retention?: ('10d' | '40d' | '400d'),
  serverSetup?: ServerSetup,
  telegraf?: ApiSecrets,
}

type Provider = {
  displayName: string,
  email: string,
  photoURL: string,
  providerId: string,
  uid: string,
}

export type ProviderId = 'google.com' | 'github.com'

export default class User {

  auth: ?any
  db: ?DB

  get id(): ?string {
    if (this.auth == null) {
      return null
    }
    return this.auth.uid
  }

  get email(): ?string {
    if (this.auth == null) { return null }
    return this.auth.email
  }
  get displayName(): ?string {
    if (this.auth == null) { return null }
    return this.auth.displayName
  }
  get authenticated(): boolean {
    return this.db != null && this.auth != null && !!this.auth.email
  }

  get planId(): ?string {
    if (this.db == null) { return null }
    return this.db.planId
  }

  get serverSetupCompleted(): boolean {
    return this.serverSetupStatus === SERVER_SETUP_STATUS.COMPLETED
  }

  get serverSetupStatus(): ?ServerSetupStatus {
    if (this.db == null || this.db.serverSetup == null) { return SERVER_SETUP_STATUS.NOT_STARTED }
    return this.db.serverSetup.status
  }

  get serverSetup(): ?ServerSetup {
    if (this.db == null || this.db.serverSetup == null) { return null }
    return this.db.serverSetup
  }

  get emailVerified(): boolean {
    if (this.auth == null) { return false }
    return !!this.auth.emailVerified
  }

  get apiSecrets(): ?ApiSecrets {
    if (this.db == null || this.db.telegraf == null) { return null }
    return {
      consumerId: this.db.telegraf.consumerId,
      token: this.db.telegraf.token,
    }
  }

  get canChangeEmail(): boolean {
    const providerData = this.getProviderData()
    if (providerData == null || providerData.length !== 0) { return false }
    return providerData[0].providerId === 'password'
  }

  getId(): string {
    if (this.auth == null) { throw new Error('auth is null') }
    return this.auth.uid
  }

  getPlanId(): PlanId {
    if (this.db == null || this.db.planId == null) {
      throw new Error('planId is null')
    }
    return this.db.planId
  }

  getPlan(): Plan {
    const planId = this.getPlanId()
    const plan = plans.get(planId)
    if (plan == null) { throw new Error('plan is null') }
    return plan
  }

  getServerSetup(): ServerSetup {
    const serverSetup = this.serverSetup
    if (serverSetup == null) { throw new Error('serverSetup is null') }
    return serverSetup
  }

  getEmail(): string {
    if (this.auth == null) { throw new Error('auth is null') }
    return this.auth.email
  }

  getCompanyName(): string {
    if (this.db == null) { throw new Error('db is null') }
    return this.db.companyName
  }

  getFullName(): string {
    if (this.db == null) { throw new Error('db is null') }
    return this.db.fullName
  }

  getCustomerId(): string {
    if (this.db == null || this.db.customerId == null) { throw new Error('customerId is null') }
    return this.db.customerId
  }

  getProviderData(): Array<Provider> {
    if (this.auth == null) { throw new Error('db is null') }
    return this.auth.providerData
  }

  getApiSecrets(): ApiSecrets {
    if (this.db == null) { throw new Error('db is null') }
    if (this.db.telegraf == null) { throw new Error('db.telegraf is null') }
    return this.db.telegraf
  }

  sendEmailVerification(): void {
    if (this.auth == null) { throw new Error('auth is null') }
    this.auth.sendEmailVerification()
  }

  async verifyEmail(code: string): Promise<void> {
    if (this.auth == null) { throw new Error('auth is null') }
    await this.auth.applyActionCode(code)
  }
}
