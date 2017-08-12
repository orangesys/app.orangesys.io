// @flow

import React, { Component } from 'react'
import { FlatButton, Paper } from 'material-ui'

import Actions from './actions'
import { User } from '../../core'
import type { State as VerificationGuideState } from './reducer'
import styles from './styles.css'

type Props = {
  actions: Actions,
  user: User,
  verificationGuide: VerificationGuideState,
}

export default class VerificationGuide extends Component<void, Props, void> {
  props: Props

  resendEmail = async () => {
    const { actions, user } = this.props
    await actions.resendVerificationMail(user)
  }

  render() {
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper>
            <div className={styles.main}>
              <p className={styles.guide}>
                送信されたメールを確認しメールアドレスの認証を行ってください。
              </p>
              <div className={styles.resend}>
                <FlatButton
                  label="確認メールを再送信"
                  primary
                  onClick={this.resendEmail}
                  disabled={this.props.verificationGuide.submitting}
                />
              </div>
            </div>
          </Paper>
        </div>
        <div className={styles['layout-offset-right']} />
      </div>
    )
  }
}
