// @ts-nocheck
import SERVER_SETUP_STATUS from 'const/server-setup-status'
import { plans, PlanIdType, PlanType } from 'modules/plan/plans'

export type ServerSetupStatus = 'not-started' | 'building' | 'completed' | 'errored'

type ServerSetup = {
  status: ServerSetupStatus
  startedAt?: string
  completedAt?: string
  errorCode?: string
  pingErrors: {
    [key: string]: string
  }
}

export type ApiSecrets = {
  consumerId: string
  token: string
}

export type DBUser = {
  companyName: string
  createdAt: string
  fullName: string
  email: string
  customerId?: string
  planId?: 'small' | 'medium' | 'large'
  retention?: '10d' | '40d' | '400d'
  serverSetup?: ServerSetup
  telegraf?: ApiSecrets
  server: {
    storageUsage: number
  }
}

type Provider = {
  displayName: string
  email: string
  photoURL: string
  providerId: string
  uid: string
}

export type ProviderId = 'google.com' | 'github.com'

export default class User {
  auth?: any
  db?: DBUser

  get id(): string | null {
    if (this.auth == null) {
      return null
    }
    return this.auth.uid
  }

  get email(): string | null {
    if (this.auth == null) {
      return null
    }
    return this.auth.email
  }
  get displayName(): string | null {
    if (this.auth == null) {
      return null
    }
    return this.auth.displayName
  }
  get authenticated(): boolean {
    return this.db != null && this.auth != null && !!this.auth.email
  }

  get planId(): string | null {
    if (this.db == null) {
      return null
    }
    return this.db.planId
  }

  // FIXME: private
  private get serverSetupStatus(): ServerSetupStatus {
    if (this.db == null || this.db.serverSetup == null) {
      return SERVER_SETUP_STATUS.NOT_STARTED
    }
    return this.db.serverSetup.status
  }

  get serverSetupNotStarted(): boolean {
    return this.serverSetupStatus === SERVER_SETUP_STATUS.NOT_STARTED
  }

  get serverSetupBuilding(): boolean {
    return this.serverSetupStatus === SERVER_SETUP_STATUS.BUILDING
  }

  get serverSetupCompleted(): boolean {
    return this.serverSetupStatus === SERVER_SETUP_STATUS.COMPLETED
  }

  get serverSetupErrored(): boolean {
    return this.serverSetupStatus === SERVER_SETUP_STATUS.ERRORED
  }

  get serverSetup(): ServerSetup | null {
    if (this.db == null || this.db.serverSetup == null) {
      return null
    }
    return this.db.serverSetup
  }

  get emailVerified(): boolean {
    if (this.auth == null) {
      return false
    }
    return !!this.auth.emailVerified
  }

  get loggedIn(): boolean {
    return !!this.auth?.uid
  }

  get planSelected(): boolean {
    return !!this.planId
  }

  get apiSecrets(): ApiSecrets | null {
    if (this.db == null || this.db.telegraf == null) {
      return null
    }
    return {
      consumerId: this.db.telegraf.consumerId,
      token: this.db.telegraf.token,
    }
  }

  get storageUsage(): number {
    return this.db?.server.storageUsage ?? 0
  }

  get canChangeEmail(): boolean {
    const providerData = this.getProviderData()
    if (providerData == null || providerData.length !== 0) {
      return false
    }
    return providerData[0].providerId === 'password'
  }

  getId(): string {
    if (this.auth == null) {
      throw new Error('auth is null')
    }
    return this.auth.uid
  }

  getPlanId(): PlanIdType {
    if (this.db == null || this.db.planId == null) {
      throw new Error('planId is null')
    }
    return this.db.planId
  }

  getPlan(): PlanType {
    const planId = this.getPlanId()
    const plan = plans.get(planId)

    return plan
  }

  getServerSetup(): ServerSetup {
    const serverSetup = this.serverSetup
    if (serverSetup == null) {
      throw new Error('serverSetup is null')
    }
    return serverSetup
  }

  getEmail(): string {
    if (this.auth == null) {
      throw new Error('auth is null')
    }
    return this.auth.email
  }

  getCompanyName(): string {
    return this.db?.companyName ?? ''
  }

  getFullName(): string {
    return this.db?.fullName ?? ''
  }

  getCustomerId(): string {
    if (this.db == null || this.db.customerId == null) {
      throw new Error('customerId is null')
    }
    return this.db.customerId
  }

  getProviderData(): Array<Provider> {
    if (this.auth == null) {
      throw new Error('db is null')
    }
    return this.auth.providerData
  }

  getApiSecrets(): ApiSecrets {
    if (this.db == null) {
      throw new Error('db is null')
    }
    if (this.db.telegraf == null) {
      throw new Error('db.telegraf is null')
    }
    return this.db.telegraf
  }

  sendEmailVerification(): void {
    if (this.auth == null) {
      throw new Error('auth is null')
    }
    this.auth.sendEmailVerification()
  }

  async verifyEmail(code: string): Promise<void> {
    if (this.auth == null) {
      throw new Error('auth is null')
    }
    await this.auth.applyActionCode(code)
  }
}
