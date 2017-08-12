// @flow

export type Errors = {
  [key: string]: string
}

export default {
  'auth/user-not-found': 'ユーザが存在しないかメールアドレスとパスワードが正しくありません',
  'auth/email-already-in-use': '既に使用されているメールアドレスです',
  'auth/invalid-email': 'メールアドレスが無効です',
  'auth/operation-not-allowed': 'アカウントが無効です',
  'auth/weak-password': 'パスワードは6文字以上が必要です',
  'auth/wrong-password': 'メールアドレスとパスワードが正しくありません',
  'auth/account-exists-with-different-credential': '既に指定のメールアドレスで登録済です',
}
