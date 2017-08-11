// @flow

const ERRORS: { [key:string]: string } = {
  'auth/user-not-found': 'ユーザが存在しないかメールアドレスとパスワードが正しくありません',
  'auth/email-already-in-use': '既に使用されているメールアドレスです',
  'auth/invalid-email': 'メールアドレスが無効です',
  'auth/operation-not-allowed': 'アカウントが無効です',
  'auth/weak-password': 'パスワードは6文字以上が必要です',
  'auth/wrong-password': '認証情報が正しくありません',
  'auth/account-exists-with-different-credential': '既に指定のメールアドレスで登録済です',
  'auth/network-request-failed': 'ネットワークエラーが発生しました',
  'auth/popup-closed-by-user': '',
  'custom-auth/user-already-exists': '指定したユーザは既に登録済みです',
  'custom-auth/email-and-password-are-wrong': 'ユーザが存在しないかパスワードが異なります',
  'stripe/abort': 'ネットワークエラーが発生しました。ネットワーク設定をご確認の上再度お試しください',
  'stripe/invalid_request_error': 'クレジットカード情報が正しくありません',
  'stripe/incorrect_number': 'クレジットカード番号が正しくありません',
  'stripe/invalid_number': 'クレジットカード番号が正しくありません',
  'stripe/invalid_expiry_month': '有効期限(月)が正しくありません',
  'stripe/invalid_expiry_year': '有効期限(年)が正しくありません',
  'stripe/invalid_cvc': 'セキュリティコード(CVC)の形式が正しくありません',
  'stripe/expired_card': 'カードの有効期限が切れています',
  'stripe/incorrect_cvc': 'セキュリティコード(CVC)が正しくありません',
  'stripe/card_error': 'クレジットカードの情報が正しくありません',
  'stripe/card_declined': '指定のクレジットカードは有効ではありません',
  'stripe/missing': 'クレジットカード情報が正しくありません',
  'stripe/processing_error': '登録時にエラーが発生しました',
}

export default ERRORS
