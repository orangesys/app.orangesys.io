// @flow
import React, { Component } from 'react'
import { CircularProgress, FlatButton, Paper } from 'material-ui'
import styles from './style.css'
import Actions from '../actions'
import type { State as EmailActionState } from '../reducer'
import { RouterOperation } from '../../../lib/router'

type Props = {
  emailAction: EmailActionState,
  actions: Actions,
  router: RouterOperation,  // eslint-disable-line react/no-unused-prop-types
}

export default class RecoverEmail extends Component<void, Props, void> {
  props: Props

  componentWillMount() {
    this.recoverEmail()
  }

  async recoverEmail() {
    const { actions, router } = this.props
    if (router.query == null || !router.query.oobCode) {
      this.props.actions.invalidate()
      return
    }
    const { oobCode, mode } = router.query
    await actions.verify(mode, oobCode)
  }

  goToNext = () => {
    window.location = '/'  // reload because emailVerified isn't changed
  }

  render() {
    const { emailAction } = this.props
    const { status } = emailAction
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper>
            <div className={styles.main}>
              {status === 'WAITING' &&
                <CircularProgress />
              }
              {status === 'VERIFYING' &&
                <p>処理中です</p>
              }
              {status === 'INVALID' &&
                <p>認証コードが無効です</p>
              }
              {status === 'VERIFIED' &&
                <div>
                  <p>メールアドレスの変更を取り消しました</p>
                  <FlatButton
                    label="次へ"
                    secondary
                    onClick={this.goToNext}
                  />
                </div>
              }
            </div>
          </Paper>
        </div>
        <div className={styles['layout-offset-right']} />
      </div>
    )
  }
}
