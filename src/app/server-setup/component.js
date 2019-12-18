// @flow
/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react'
import { Paper, CircularProgress } from 'material-ui'

import Actions from './actions'
import { INFO } from '../../const'
import { User, SERVER_SETUP_STATUS } from '../../core'
import type { RouterProp } from '../../lib/router'

import styles from './styles.css'

type Props = {
  // serverSetup: any,
  user: User,
  actions: Actions,
  router: RouterProp,
}

export default class ServerSetup extends Component<void, Props, void> {

  props: Props

  componentDidMount() {
    (async () => {
      await this.setUpServerIfNeeded()
    })()
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user.serverSetupStatus === SERVER_SETUP_STATUS.COMPLETED) {
      this.props.router.redirectTo('/')
    }
  }

  componentDidUpdate() {
    (async () => {
      await this.setUpServerIfNeeded()
    })()
  }

  async setUpServerIfNeeded() {
    if (this.isErrored) { return }
    const { user } = this.props
    if (user.serverSetupStatus === SERVER_SETUP_STATUS.NOT_STARTED) {
      await this.props.actions.requestCreatingServer(user)
    }
    if (user.serverSetupStatus === SERVER_SETUP_STATUS.BUILDING) {
      await this.props.actions.waitForBuilding()
    }
  }

  get isProcessing(): boolean {
    const { user } = this.props
    const status = user.serverSetupStatus
    return [
      SERVER_SETUP_STATUS.NOT_STARTED,
      SERVER_SETUP_STATUS.BUILDING,
    ].includes(status)
  }

  get isErrored(): boolean {
    const { user } = this.props
    return user.serverSetupStatus != null && user.serverSetupStatus === SERVER_SETUP_STATUS.ERRORED
  }

  render() {
    const { user } = this.props
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            {this.isProcessing &&
              <div className={styles.processing}>
                <p className={styles.message}>現在サーバ構築中です。しばらくお待ちください</p>
                <div className={styles.progress}>
                  <CircularProgress size={60} thickness={5} />
                </div>
              </div>
            }
            {this.isErrored &&
              <div className={styles.error}>
                <div className={styles['error-text']}>
                  <p>サーバ構築時完了次第、管理者から連絡致します。</p>
                  <p>ErrorCode: {user.getServerSetup().errorCode}</p>
                </div>
                <p>
                  <a href={`mailto:${INFO.SUPPORT_EMAIL}`}>{INFO.SUPPORT_EMAIL}</a> までお問い合わせください。
                </p>
              </div>
            }
          </Paper>
        </div>
        <div className={styles['layout-offset-left']} />
      </div>
    )
  }
}
