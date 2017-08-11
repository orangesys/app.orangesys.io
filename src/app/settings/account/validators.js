// @flow
import validate from '../../../lib/validator'


export const validateProfileUpdate = (fields: Object) => {
  const rules = {
    companyName: 'required|min:2|max:100',
    fullName: 'required|min:2|max:50',
  }
  return validate(rules, fields)
}

export const validateEmailChange = (fields: Object) => {
  const rules = {
    email: 'required|email|max:255',
    password: 'required',
  }
  return validate(rules, fields)
}
