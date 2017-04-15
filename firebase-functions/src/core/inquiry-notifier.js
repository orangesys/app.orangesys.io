
export default class InquiryNotifier {
  constructor(mailer) {
    this.mailer = mailer
  }
  generateMessageBody(text) {
    return [
      '',
      '----------------------------------------------------------------------',
      text,
      '----------------------------------------------------------------------',
      '',
      `会社名: ${this.user.companyName}`,
      `フルネーム: ${this.user.fullName}`,
      `メールアドレス: ${this.user.email}`,
    ].join("\n")
  }

  setInformationForMail(config, user) {
    this.config = config
    this.user = user
  }

  async sendMailToAdmin({ inquiryId, body }) {
    const cfg = this.config
    const requestBody = {
      FromEmail: cfg.from,
      FromName: cfg.fromName,
      Subject: `[OrangeSys] お問い合わせ (${inquiryId})`,
      'Text-part': this.generateMessageBody(body),
      Recipients: [{ Email: cfg.to, }],
      Headers: { 'Reply-To': this.user.email },
    }
    const connectedMailer = this.mailer.connect(cfg.mailjetPublicKey, cfg.mailjetPrivateKey)
    console.log('sending mail :', requestBody)
    await connectedMailer.post('send').request(requestBody)
  }
}
