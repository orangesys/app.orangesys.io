// @flow

export type StripeErrors = { [key: string]: string }

const STRIPE_ERRORS: StripeErrors = {
  abort: 'ネットワークエラーが発生しました。ネットワーク設定をご確認の上再度お試しください',
  invalid_request_error: 'クレジットカード情報が正しくありません',
  incorrect_number: 'クレジットカード番号が正しくありません',
  invalid_number: 'クレジットカード番号が正しくありません',
  invalid_expiry_month: '有効期限(月)が正しくありません',
  invalid_expiry_year: '有効期限(年)が正しくありません',
  invalid_cvc: 'セキュリティコード(CVC)の形式が正しくありません',
  expired_card: 'カードの有効期限が切れています',
  incorrect_cvc: 'セキュリティコード(CVC)が正しくありません',
  card_declined: '指定のクレジットカードは有効ではありません',
  missing: 'クレジットカード情報が正しくありません',
  processing_error: '登録時にエラーが発生しました',
}

export default STRIPE_ERRORS
