// @flow
import validate from '../../../lib/validator'

export const validatePasswordReset = (fields: any) => {
  const rules = {
    email: 'required|email|max:255',
  }
  return validate(rules, fields)
}
