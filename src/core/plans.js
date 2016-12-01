import { find } from 'lodash/collection';

export const plans = [
  {
    id: 'small',
    price: '50,000',
    retention: '10d',
    retentionText: '10日',
    storage: '10GB',
    title: 'Smallプラン',
  },
  {
    id: 'medium',
    price: '300,000',
    retention: '40d',
    retentionText: '40日',
    title: 'Mediumプラン',
    storage: '30GB',
  },
  {
    id: 'large',
    price: '500,000',
    retention: '400d',
    retentionText: '400日',
    storage: '100GB',
    title: 'Largeプラン',
  },
];

export const findPlan = (id) => (find(plans, { id }));
