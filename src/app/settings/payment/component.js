// @flow
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react'
import { Paper } from 'material-ui'
import Actions from './actions'
import { CreditCardForm } from '../../parts'
import { User } from '../../../core'
import styles from './style.css'

type Props = {
  actions: Actions,
  user: User,
}

type State = {
  submitting: boolean
}

export default class PaymentSetting extends Component<void, Props, State> {
  props: Props
  state: State = {
    submitting: false,
  }

  onSubmit = async (e: SyntheticInputEvent) => {
    const { actions, user } = this.props
    e.preventDefault()
    this.setState({ submitting: true })
    const succeeded = await actions.changeCreditCard(e.target, user)
    this.setState({ submitting: false })
    return succeeded
  }

  render() {
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            <div className={styles.payment}>
              <CreditCardForm
                onSubmit={this.onSubmit}
                submitting={this.state.submitting}
                guideText="クレジットカード情報を更新します。"
              />
            </div>
          </Paper>
        </div>
        <div className={styles['layout-offset-left']} />
      </div>
    )
  }
}
