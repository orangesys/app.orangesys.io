// @flow
import validate from '../../../lib/validator'

export const validateNewPassword = (fields: Object) => {
  const rules = {
    password: 'required|min:8|max:16',
  }
  return validate(rules, fields)
}
