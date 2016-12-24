import { validate } from 'src/core/validation';

export const validateSignUp = (data) => {
  const rules = {
    companyName: 'required|min:2|max:100',
    fullName: 'required|min:2|max:50',
    email: 'required|email|max:255',
    password: 'required|min:8|max:16',
  };
  return validate(rules, data);
};
