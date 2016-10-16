import { find } from 'lodash/collection';

export const plans = [
  { id: 'small', retention: '10d', title: 'Smallプラン', subtitle: '¥50,000/月 データ保存期間: 10日' },
  { id: 'medium', retention: '40d', title: 'Mediumプラン', subtitle: '¥300,000/月 データ保存期間: 40日' },
  { id: 'large', retention: '400d', title: 'Largeプラン', subtitle: '¥500,000/月 データ保存期間: 400日' },
];

export const findPlan = (id) => (find(plans, { id }));
