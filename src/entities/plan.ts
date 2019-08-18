export enum PlanType {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
}

export class Plan {
  constructor(
    public type: PlanType,
    public price: number,
    public retentionPeriod: number,
    public storage: number,
  ) {}

  static getAllPlans(): Plan[] {
    return [
      new Plan(PlanType.SMALL, 50000, 10, 10),
      new Plan(PlanType.MEDIUM, 300000, 40, 30),
      new Plan(PlanType.LARGE, 500000, 400, 100),
    ]
  }

  static fromType(type: PlanType): Plan {
    return this.getAllPlans().find((p): boolean => p.type === type)
  }
}
