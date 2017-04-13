import { config } from 'firebase-functions'
import mailjet from 'node-mailjet'
import InquiryNotifier from '../core/inquiry-notifier'
import { getUserData } from '../core/user'

export const sendInquiryNotification = async (event, admin) => {
  const inquiry = new Inquiry(config(), admin, InquiryNotifier)
  return await inquiry.sendNotification(event)
}

export class Inquiry {
  constructor(config, admin, notifier) {
    this.config = config
    this.admin = admin
    this.notifier = notifier
  }
  async getUserData(uid) {
    return getUserData(this.admin.database, uid)
  }
  async sendNotification(event) {
    const inquiryId = event.params.id
    const { uid, body } = event.data.val()
    const userRecord = await this.admin.auth().getUser(uid)
    const cfg = this.config.mail

    const userData = await this.getUserData(uid)
    const user = { ...userRecord, ...userData }

    const notifierConfig = {
      mailjetPublicKey: cfg.mailjet_public_key,
      mailjetPrivateKey: cfg.mailjet_private_key,
      from: cfg.from,
      fromName: 'OrangeSys Auto Mail',
      to: cfg.to,
    }
    this.notifier.setInformationForMail(config, user)
    await this.notifier.sendMailToAdmin({ inquiryId, body })
  }
}
