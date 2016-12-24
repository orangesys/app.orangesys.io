import Validator from 'validatorjs';
import { Map } from 'immutable';

export const messages = {
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
};

export const attrNames = {
  companyName: '会社名',
  email: 'メールアドレス',
  password: 'パスワード',
};

export const validate = (rules, data) => {
  const necessaryRules = new Map(data).reduce((o, v, k) => (
    (rules[k]) ? o.merge({ [k]: rules[k] }) : o
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
