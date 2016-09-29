import Validator from 'validatorjs';
import { Map } from 'immutable';
import { messages, attrNames } from 'src/core/validation';

export const validateSignUp = (data) => {
  const rules = {
    companyName: 'required|min:2|max:100',
    fullName: 'required|min:2|max:50',
    email: 'required|email|max:255',
    password: 'required|min:8|max:16',
  };
  const necessaryRules = new Map(data).reduce((o, v, k) => (
    o.merge({ [k]: rules[k] })
  ), new Map()).toObject();
  const validation = new Validator(data, necessaryRules, messages);
  validation.setAttributeNames(attrNames);
  if (validation.passes()) {
    return new Map();
  }
  const allErrors = validation.errors.all();
  const errors = new Map(allErrors).reduce((o, v, k) => (
    o.merge({ [k]: v[0] })
  ), new Map());
  return errors;
};
