// @flow
import mailjet from 'node-mailjet'
import InquiryNotifier from '../core/inquiry-notifier'
import { getUserData } from '../core/user'

type Event = {
  params: {
    id: string,
  },
  data: {
    val: () => { uid: string, body: string },
  },
}

export class Inquiry {
  admin: any
  notifier: InquiryNotifier
  getUserData: Function
  constructor(admin: any, notifier: InquiryNotifier, _getUserData: Function) {
    this.admin = admin
    this.notifier = notifier
    this.getUserData = _getUserData
  }

  async getUser(uid: string): Object {
    const userData = await this.getUserData(this.admin.database, uid)
    const userRecord = await this.admin.auth().getUser(uid)
    return { ...userRecord, ...userData }
  }

  async sendNotification(event: Event): Promise<void> {
    const inquiryId = event.params.id
    const { uid, body } = event.data.val()
    const user = await this.getUser(uid)
    await this.notifier.sendMailToAdmin(user, { inquiryId, body })
  }
}

type NotifierConfig = {
  mailjetPublicKey: string,
  mailjetPrivateKey: string,
  from: string,
  fromName: string,
  to: string,
}

type MailConfig = {
  mailjet_public_key: string,
  mailjet_private_key: string,
  from: string,
  to: string,
}

type Config = () => {
  mail: MailConfig,
}

export const notifierConfig = (cfg: MailConfig): NotifierConfig => (
  {
    mailjetPublicKey: cfg.mailjet_public_key,
    mailjetPrivateKey: cfg.mailjet_private_key,
    from: cfg.from,
    fromName: 'OrangeSys Auto Mail',
    to: cfg.to,
  }
)

export const sendInquiryNotification = async (event: Event, admin: Object, config: Config) => {
  const cfg = config().mail
  const notifier = new InquiryNotifier(
    mailjet,
    notifierConfig(cfg), getUserData)

  const inquiry = new Inquiry(admin, notifier, getUserData)
  return await inquiry.sendNotification(event)
}
