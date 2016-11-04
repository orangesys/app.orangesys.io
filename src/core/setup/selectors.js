export function getSetup(state) {
  return state.setup;
}

export function planSelected(state) {
  return !!state.setup.planId;
}

export function getSelectedPlanId(state) {
  return state.setup.planId;
}
