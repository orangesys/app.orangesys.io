import { reduce } from 'lodash/collection';

export const getCSSPropertyOf = (name) => (
  getComputedStyle(document.documentElement).getPropertyValue(name)
);

export const getInputValues = (fields, target) => (
  reduce(fields, (o, key) => (
    Object.assign({}, o, { [key]: target[key].value.trim() })
  ), {})
);
