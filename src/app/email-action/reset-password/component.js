// @flow

/* eslint-disable */
import React, { Component } from 'react'
import { CircularProgress, FlatButton, Paper, FontIcon, TextField, RaisedButton } from 'material-ui'
import styles from './style.css'
import Actions from './actions'
import * as validators from './validators'
import type { State as ResetPasswordState } from '../reducer'
import PaperWithTitle from '../../parts/paper-with-title'
import { RouterOperation } from '../../../lib/router'


type Props = {
  resetPassword: ResetPasswordState,
  actions: Actions,
  router: RouterOperation,  // eslint-disable-line react/no-unused-prop-types
}

type State = {
  email: ?string,
  errors: { [key: string]: string },
  submitting: boolean,
}

export default class RecoverEmail extends Component<void, Props, State> {
  props: Props
  state: State = {
    email: null,
    errors: {},
    submitting: false,
  }

  get status(): string {
    return this.props.resetPassword.status
  }

  get shouldVerify(): boolean {
    return this.status === 'WAITING'
  }

  get verified(): boolean {
    return ['VERIFIED', 'RESETTING'].includes(this.status)
  }

  get oobCode(): string {
    const query = this.props.router.query
    if (query == null) { return '' }
    return query.oobCode || ''
  }

  async verify(oobCode: string) {
    const email = await this.props.actions.verify(this.oobCode)
    if (email == null) { return }
    this.setState({ email })
  }

  componentWillMount() {
    const { actions, router } = this.props
    if (this.oobCode === '') {
      this.props.actions.invalidate()
      return
    }
    if (this.shouldVerify) {
      this.verify(this.oobCode)
    }
  }

  goToLogin = () => {
    this.props.router.redirectTo('/login')
  }

  goToNext = () => {
    window.location.reload()
  }

  onSubmit = async (e: any) => {
    e.preventDefault()
    const password = e.target.password.value
    const errors = validators.validateNewPassword({ password })
    this.setState({ errors })
    if (Object.keys(errors).length > 0) { return }

    this.setState({ submitting: true })
    const succeeded = await this.props.actions.changePassword(this.oobCode, password)
    this.setState({ submitting: false })
  }

  render() {
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset']} />
        <div className={styles['layout-main']}>
          <PaperWithTitle title="パスワードの再設定">
            <div className={styles.main}>
              {(this.status === 'WAITING' || this.status === 'VERIFYING') &&
                <p>認証中です</p>
              }
              {this.status === 'INVALID' &&
                <div>
                  <p>認証コードが無効です。</p>
                  <p>ログイン画面から再度再設定のメールを送信してください。</p>
                  <div className={styles.login}>
                    <FlatButton
                      label="ログイン画面へ"
                      secondary
                      onClick={this.goToLogin}
                      icon={<FontIcon className="fa fa-sign-in" />}
                    />
                  </div>
                </div>
              }
              {this.verified &&
                <div>
                  <p>{this.state.email}</p>
                  <form onSubmit={this.onSubmit}>
                    <TextField
                      name="password"
                      hintText="新しいパスワード"
                      type="password"
                      errorText={this.state.errors.password}
                    />
                    <div>
                      <RaisedButton
                        type="submit"
                        className={styles.submit}
                        label="パスワードを変更"
                        primary
                        disabled={this.state.submitting}
                      />
                    </div>
                  </form>
                </div>
              }
              {this.status === 'RESET' &&
              <div>
                <p>パスワードを変更しました</p>
                <div className={styles.login}>
                  <FlatButton
                    label="ログイン画面へ"
                    secondary
                    onClick={this.goToLogin}
                    icon={<FontIcon className="fa fa-sign-in" />}
                  />
                </div>
              </div>
              }
            </div>
          </PaperWithTitle>
        </div>
        <div className={styles['layout-offset-right']} />
      </div>
    )
  }
}
