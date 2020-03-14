import User, { DBUser } from './user'

type UserObject = {
  db: DBUser
  auth: Object
}

export default class UserFactory {
  static createFromObject(obj: UserObject): User {
    const user = new User()
    user.db = obj.db
    user.auth = obj.auth
    return user
  }
}
