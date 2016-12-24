import { validate } from 'src/core/validation';

export const validateProfile = (data) => {
  const rules = {
    companyName: 'required|min:2|max:100',
    fullName: 'required|min:2|max:50',
  };
  return validate(rules, data);
};
