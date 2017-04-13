import 'babel-polyfill'
import assert from 'power-assert'
import td from 'testdouble'
import { Inquiry, sendInquiryNotification } from '../../src/db-handlers/inquiry'
import InquiryNotifier from '../../src/core/inquiry-notifier'

describe('Inquiry', () => {
  describe('sendNotification', () => {
    it('works', async () => {
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

      const adminStub = {
        auth: () => ({ getUser: () => { email: 'test@example.com' } }),
      }

      const notifier = new InquiryNotifier({})
      td.replace(notifier, 'setInformationForMail')
      td.replace(notifier, 'sendMailToAdmin')
      const event = {
        params: { id: inquiryId },
        data: { val: () => ({ uid, body }) },
      }

      const inquiry = new Inquiry(configDummy, adminStub, notifier)
      td.replace(inquiry, 'getUserData')
      td.when(inquiry.getUserData(uid))
        .thenResolve({
          companyName: 'Company A',
          fullName: 'Yamada Tarou',
        })
      const result = await inquiry.sendNotification(event)
      td.verify(notifier.sendMailToAdmin({ inquiryId, body }))
    })
  })
})
