// @flow
import React, { Component } from 'react'
import { Paper } from 'material-ui'

import { PlanCard } from '../parts'
import Actions from './actions'
import styles from './styles.css'
import { Plans } from '../../../core'
import type { PlanId } from '../../../core'
import { RouterOperation } from '../../../lib/router'

type Props = {
  actions: Actions,
  router: RouterOperation,
}

export default class PlanComponent extends Component<void, Props, void> {
  props: Props

  onClickPlan(planId: PlanId) {
    this.props.actions.selectPlan(planId)
    this.props.router.redirectTo('/setup/payment')
  }

  render() {
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            <p className={styles.guide}>以下よりプランを選択してください</p>
            <div className={styles.cards}>
              {[...Plans.values()].map(plan => (
                <PlanCard
                  key={`plan-card-${plan.id}`}
                  plan={plan}
                  className={styles.card}
                  onClick={() => { this.onClickPlan(plan.id) }}
                />
              ))}
            </div>
          </Paper>
        </div>
        <div className={styles['layout-offset-left']} />
      </div>
    )
  }
}
