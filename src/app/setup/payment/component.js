// @flow
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react'
import { Paper } from 'material-ui'

import type { State as SetupState } from '../reducer'
import Actions from './actions'
import { PlanCard } from '../parts'
import { CreditCardForm } from '../../parts'
import { Plans, User } from '../../../core'
import { RouterOperation } from '../../../lib/router'
import styles from './styles.css'

type Props = {
  actions: Actions,
  router: RouterOperation,
  setup: SetupState,
  user: User,
}

export default class PaymentComponent extends Component<void, Props, void> {
  props: Props
  componentWillMount() {
    const { setup, router } = this.props
    if (setup.planId == null) { router.redirectTo('/setup/plan') }
  }

  onClickPlan = (e: SyntheticInputEvent) => {
    e.preventDefault()
    this.props.router.redirectTo('/setup/plan')
  }

  onSubmit = async (e: SyntheticInputEvent) => {
    const { actions, setup, user } = this.props
    e.preventDefault()
    if (setup.planId == null) { throw new Error('planId is null') }
    const success = await actions.registerPayment(e.target, setup.planId, user)
    if (success) {
      this.props.router.redirectTo('/server-setup')
    }
  }

  render() {
    const { setup } = this.props
    if (setup.planId == null) { return null }
    const plan = Plans.get(setup.planId)
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            <div className={styles['selected-plan']}>
              <PlanCard plan={plan} onClick={this.onClickPlan} />
            </div>
            <div className={styles.payment}>
              <CreditCardForm
                onSubmit={this.onSubmit}
                submitting={setup.submitting}
              />
            </div>
          </Paper>
        </div>
        <div className={styles['layout-offset-left']} />
      </div>
    )
  }
}
