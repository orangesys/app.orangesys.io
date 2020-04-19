export type Errors = {
  [key: string]: {
    field: string
    message: string
  }
}

export const authErrors = {
  'auth/email-already-in-use': {
    field: 'email',
    message: '既に使用されているメールアドレスです',
  },
  'auth/invalid-email': {
    field: 'email',
    message: 'メールアドレスが無効です',
  },
  'auth/weak-password': {
    field: 'password',
    message: 'パスワードは6文字以上が必要です',
  },
  'auth/operation-not-allowed': {
    field: '',
    message: '無効操作です',
  },
}
