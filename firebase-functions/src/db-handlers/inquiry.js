import { config } from 'firebase-functions'
import mailjet from 'node-mailjet'
import InquiryNotifier from '../core/inquiry-notifier'
import { getUserData } from '../core/user'

export const notifierConfig = (cfg) => (
  {
    mailjetPublicKey: cfg.mailjet_public_key,
    mailjetPrivateKey: cfg.mailjet_private_key,
    from: cfg.from,
    fromName: 'OrangeSys Auto Mail',
    to: cfg.to,
  }
)

export const sendInquiryNotification = async (event, admin, config) => {
  const cfg = config().mail
  const notifier = new InquiryNotifier(
    mailjet,
    notifierConfig(cfg), getUserData)

  const inquiry = new Inquiry(admin, notifier, getUserData)
  return await inquiry.sendNotification(event)
}

export class Inquiry {
  constructor(admin, notifier, getUserData) {
    this.admin = admin
    this.notifier = notifier
    this.getUserData = getUserData
  }

  async getUser(uid) {
    const userData = await this.getUserData(this.admin.database, uid)
    const userRecord = await this.admin.auth().getUser(uid)
    return { ...userRecord, ...userData }
  }

  async sendNotification(event) {
    const inquiryId = event.params.id
    const { uid, body } = event.data.val()
    const user = await this.getUser(uid)
    await this.notifier.sendMailToAdmin(user, { inquiryId, body })
  }
}
