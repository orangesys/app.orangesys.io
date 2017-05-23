import 'babel-polyfill'
import assert from 'power-assert'
import td from 'testdouble'
import { Inquiry } from '../../../src/db-handlers/inquiry'
import InquiryNotifier from '../../../src/core/inquiry-notifier'

describe('Inquiry', () => {
  describe('getUser', () => {
    it('returns data from db and firebase', async () => {
      const uid = 'uid1111'
      const adminStub = {
        auth: () => ({ getUser: async () => ({ email: 'test@example.com' }) }),
      }
      const notifierDummy = {}
      const getUserDataStub = async () => ({
        companyName: 'Company A',
        fullName: 'Yamada Tarou',
      })
      const inquiry = new Inquiry(adminStub, notifierDummy, getUserDataStub)
      const result = await inquiry.getUser(uid)
      assert.deepEqual(result, {
        email: 'test@example.com',
        companyName: 'Company A',
        fullName: 'Yamada Tarou',
      })
    })
  })

  describe('sendNotification', () => {
    it('sends notification mail', async () => {
      const uid = 'uid1111'
      const inquiryId = 'inquiry-id'
      const body = 'inquiry body'

      const configDummy = {
        mail: {
          mailjet_public_key: 'dummy_public_key',
          mailjet_private_key: 'dummy_private_key',
          from: 'from@example.com',
          to: 'to@example.com',
        },
      }

      const notifier = new InquiryNotifier({}, configDummy)
      td.replace(notifier, 'sendMailToAdmin')

      const adminStub = {}
      const inquiry = new Inquiry(adminStub, notifier)
      const dummyUser = {
        email: 'test@example.com',
        companyName: 'Company A',
        fullName: 'Yamada Tarou',
      }
      td.replace(inquiry, 'getUser')
      td.when(inquiry.getUser(uid)).thenResolve(dummyUser)

      const event = {
        params: { id: inquiryId },
        data: { val: () => ({ uid, body }) },
      }
      await inquiry.sendNotification(event)

      td.verify(notifier.sendMailToAdmin(dummyUser, { inquiryId, body }))
    })
  })
})
