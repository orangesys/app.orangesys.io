import 'babel-polyfill'
import assert from 'power-assert'
import moment from 'moment'
import td from 'testdouble'

import InquiryNotifier from '../../src/core/inquiry-notifier'

describe('InquiryNotifier', () => {
  describe('sendMailToAdmin posts a mail sending request', () => {
    it('works', async () => {
      const cfg = {
        mailjetPublicKey: 'dummy',
        mailjetPrivateKey: 'dummy',
        from: 'from@example.com',
        fromName: 'FromName',
        to: 'to@example.com',
      }

      const mailer = td.object({ connect: () => {} })
      const connectedMailer = td.object({ post: () => {} })
      const request = td.function()
      td.when(mailer.connect(cfg.mailjetPublicKey, cfg.mailjetPrivateKey))
        .thenReturn(connectedMailer)
      td.when(connectedMailer.post('send')).thenReturn({ request })

      const user = {
        email: 'user@example.com',
        companyName: 'Company A',
        fullName: 'Yamada Tarou',
      }
      const notifier = new InquiryNotifier(mailer)
      notifier.setInformationForMail(cfg, user)

      const inquiryId = 'inquiry-id'
      const body = 'inquiry message'
      td.replace(notifier, 'generateMessageBody')
      td.when(notifier.generateMessageBody(body))
        .thenReturn(`xxxx ${body} xxxx`)
      const result = await notifier.sendMailToAdmin({ inquiryId, body })

      td.verify(request({
        FromEmail: cfg.from,
        FromName: cfg.fromName,
        Subject: `[OrangeSys] お問い合わせ (${inquiryId})`,
        'Text-part': `xxxx ${body} xxxx`,
        Recipients: [{ Email: cfg.to, }],
        Headers: { 'Reply-To': user.email },
      }))
    })
  })
})
