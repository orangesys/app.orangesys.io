import td from 'testdouble'
import moment from 'moment'
import UserService from '../user-service'

describe('UserService', () => {
  describe('createUserWithPassword', () => {
    const email = 'test@example.com'
    const password = 'asdfasdf'
    const newUserFields = {
      companyName: 'Example Inc.',
      fullName: 'Taro Yamada',
      email,
      createdAt: moment().utc().format(),
    }
    const uid = 'asdfasdf'

    it('creates an user and add user record on DB', async () => {
      const firebase = td.object({
        createUserWithEmailAndPassword: () => {},
      })
      const userAuth = td.object({ uid, sendEmailVerification: () => {} })
      td.when(firebase.createUserWithEmailAndPassword(email, password))
        .thenResolve(userAuth)
      const userRepository = td.object({
        createUserWithPassword: () => {},
        addNewUserOnDB: () => {},
      })
      td.when(userRepository.createUserWithPassword(email, password))
        .thenResolve(userAuth)

      const userFactory = td.object({
        createFromObject: () => {},
      })

      const userService = new UserService(userRepository, userFactory)
      await userService.createUserWithPassword(password, newUserFields)

      td.verify(userAuth.sendEmailVerification())
      td.verify(userRepository.addNewUserOnDB(uid, newUserFields))
      td.verify(userFactory.createFromObject({
        db: newUserFields,
        auth: userAuth,
      }))
    })
  })
})
