// @flow

import User from './user'
import type { DB } from './user'

type UserObject = {
  db: DB,
  auth: Object,
}

export default class UserFactory {
  static createFromObject(obj: UserObject): User {
    const user = new User()
    user.db = obj.db
    user.auth = obj.auth
    return user
  }
}
