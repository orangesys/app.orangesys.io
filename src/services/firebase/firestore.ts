import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import { User } from 'entities/user'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

enum Collections {
  USERS = 'users',
}

export interface CreateUserInput {
  uid: string
  email: string
  fullName: string
  company: string
}

interface UserDoc extends firebase.firestore.DocumentData {
  email: string
  fullName: string
  companyName: string
  planID?: string
  plan?: string
  state?: boolean
  subDomain?: string
  prometheusLabel?: string
  telegrafToken?: string
}

@autoinject
export class FirestoreService {
  private readonly logger = getLogger(FirestoreService.name)

  constructor(private store: firebase.firestore.Firestore) {}

  async getUser(uid: string): Promise<User | null> {
    this.logger.debug('getUser', uid)
    const doc = await this.store
      .collection(Collections.USERS)
      .doc(uid)
      .get()

    if (!doc.exists) {
      return null
    }
    const data = doc.data() as UserDoc

    const user = new User(uid, data.email, data.companyName)
    user.planId = data.planID
    user.plan = data.plan
    user.state = data.state

    return user
  }

  async createUser(uid: string, email: string, fullName: string, company: string): Promise<void> {
    const data: UserDoc = {
      email,
      fullName,
      companyName: company,
    }
    try {
      await this.store
        .collection(Collections.USERS)
        .doc(uid)
        .set(data)
    } catch (err) {
      this.logger.error(`failed to create user`, err)
    }
  }
}
