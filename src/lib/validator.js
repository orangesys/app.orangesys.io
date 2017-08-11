// @flow
import Validator from 'validatorjs'

export type Rules = {
  [key: string]: string
}

export type Data = {
  [key: string]: any
}

export type Errors = {
  [key: string]: string,
}

type Messages = {
  [key: string]: string | { [key: string]: string },
}
type AttributeNames = { [key:string]: string }

export type Options = {
  attributeNames?: AttributeNames,
  messages?: Messages,
}

const DEFAULT_ATTRIBUTE_NAMES: AttributeNames = {}
const DEFAULT_MESSAGES: Messages = {
  required: '入力が必要です',
  email: 'メールアドレスの形式が正しくありません',
  min: {
    string: ':min文字以上で入力してください',
    numeric: ':min以上の値を入力してください',
  },
  max: {
    string: ':max文字以下で入力してください',
    numeric: ':max以下の値を入力してください',
  },
}

const validate = (rules: Rules, data: Data, options: Options = {}) => {
  // use only attributes that exists in data
  const necessaryRules = Object.keys(data)
    .filter(key => !!rules[key])
    .reduce((o, key) => ({
      ...o,
      [key]: rules[key],
    }), {})

  const messages = {
    ...DEFAULT_MESSAGES,
    ...options.messages,
  }
  const validation = new Validator(data, necessaryRules, messages)
  const attrNames = {
    ...DEFAULT_ATTRIBUTE_NAMES,
    ...options.attributeNames,
  }
  validation.setAttributeNames(attrNames)
  if (validation.passes()) {
    return new Map()
  }
  const allErrors: Errors = validation.errors.all()
  const errors = Object.keys(allErrors).reduce((o, key) => ({
    ...o, [key]: allErrors[key][0],
  }), {})
  return errors
}
export default validate
