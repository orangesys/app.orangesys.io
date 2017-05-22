
export default class InquiryNotifier {
  constructor(mailer, config) {
    this.mailer = mailer
    this.config = config
  }
  static generateMessageBody(user, text) {
    return [
      '',
      '----------------------------------------------------------------------',
      text,
      '----------------------------------------------------------------------',
      '',
      `会社名: ${user.companyName}`,
      `フルネーム: ${user.fullName}`,
      `メールアドレス: ${user.email}`,
    ].join('\n')
  }

  async sendMailToAdmin(user, { inquiryId, body }) {
    const cfg = this.config
    const requestBody = {
      FromEmail: cfg.from,
      FromName: cfg.fromName,
      Subject: `[OrangeSys] お問い合わせ (${inquiryId})`,
      'Text-part': InquiryNotifier.generateMessageBody(user, body),
      Recipients: [{ Email: cfg.to }],
      Headers: { 'Reply-To': user.email },
    }
    const connectedMailer = this.mailer.connect(cfg.mailjetPublicKey, cfg.mailjetPrivateKey)
    console.log('sending mail :', requestBody)
    await connectedMailer.post('send').request(requestBody)
  }
}
