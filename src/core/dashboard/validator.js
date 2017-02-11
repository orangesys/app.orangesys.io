import { validate as doValidate } from 'src/core/validation';

export const validateInquiry = (data) => {
  const rules = {
    body: 'required|max:1000',
  };
  return doValidate(rules, data);
};
