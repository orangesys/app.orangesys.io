// @flow
export const SELECT_PLAN = 'setup/select-plan'

export default class Actions {
  dispatch: (action: any) => any

  constructor(
    dispatch: (action: any) => any,
  ) {
    this.dispatch = dispatch
  }

  selectPlan(planId: string): void {
    this.dispatch({ type: SELECT_PLAN, planId })
  }
}
