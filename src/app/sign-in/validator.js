// @flow
import validate from '../../lib/validator'

export const validateSignInWithPassword = (fields: any) => {
  const rules = {
    email: 'required|email|max:255',
    password: 'required',
  }
  return validate(rules, fields)
}
