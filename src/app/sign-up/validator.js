// @flow
import validate from '../../lib/validator'

import type { InputFieldsWithPassword, InputFieldsForOAuth } from './index'

export const validateSignUpWithOAuth = (fields: InputFieldsForOAuth) => {
  const rules = {
    companyName: 'required|min:2|max:100',
    fullName: 'required|min:2|max:50',
  }
  return validate(rules, fields)
}

export const validateSignUpWithEmailAndPassword = (fields: InputFieldsWithPassword) => {
  const rules = {
    companyName: 'required|min:2|max:100',
    fullName: 'required|min:2|max:50',
    email: 'required|email|max:255',
    password: 'required|min:8|max:16',
  }
  return validate(rules, fields)
}
