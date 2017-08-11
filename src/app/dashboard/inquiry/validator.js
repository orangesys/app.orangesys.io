// @flow
import validate from '../../../lib/validator'

export const validateInquiry = (fields: Object) => {
  const rules = {
    body: 'required|min:1|max:100',
  }
  return validate(rules, fields)
}
