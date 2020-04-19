export type PlanIdType = 'small' | 'medium' | 'large'
export type RetentionType = '10d' | '40d' | '400d'

export type PlanType = {
  id: PlanIdType
  price: '50,000' | '300,000' | '500,000'
  retention: '10d' | '40d' | '400d'
  retentionText: '10日' | '40日' | '400日'
  storage: '10GB' | '30GB' | '100GB'
  storageByte: number
  title: 'Smallプラン' | 'Mediumプラン' | 'Largeプラン'
}

const plans: Map<PlanIdType, PlanType> = new Map()
plans.set('small', {
  id: 'small',
  price: '50,000',
  retention: '10d',
  retentionText: '10日',
  storage: '10GB',
  storageByte: 10 * 1024 * 1024 * 1024,
  title: 'Smallプラン',
})
plans.set('medium', {
  id: 'medium',
  price: '300,000',
  retention: '40d',
  retentionText: '40日',
  title: 'Mediumプラン',
  storage: '30GB',
  storageByte: 30 * 1024 * 1024 * 1024,
})
plans.set('large', {
  id: 'large',
  price: '500,000',
  retention: '400d',
  retentionText: '400日',
  storage: '100GB',
  title: 'Largeプラン',
  storageByte: 100 * 1024 * 1024 * 1024,
})

export { plans }
