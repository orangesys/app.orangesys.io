// @flow
import React, { Component } from 'react'
import { Dialog, TextField, FlatButton } from 'material-ui'
import * as validators from './validators'
import styles from './style.css'

type Props = {
  onCancel: Function,
  onSubmit: Function,
}

type State = {
  submitting: boolean,
  errors: { [key: string]: string },
}

export default class PasswordReset extends Component<void, Props, State> {
  email: any
  props: Props
  state: State = {
    errors: {},
    submitting: false,
  }

  onSubmit = (e: any) => {
    e.preventDefault()
    const email = this.email.getValue()
    const errors = validators.validatePasswordReset({ email })
    this.setState({ errors })
    if (Object.keys(errors).length > 0) {
      return
    }
    this.setState({ submitting: true })
    this.props.onSubmit(email)
  }

  render() {
    const { onCancel } = this.props
    const { submitting } = this.state
    const actions = [
      <FlatButton
        label="キャンセル"
        onClick={onCancel}
      />,
      <FlatButton
        label="送信"
        onClick={this.onSubmit}
        primary
        disabled={submitting}
      />,
    ]
    return (
      <Dialog
        actions={actions}
        modal
        open
        onRequestClose={onCancel}
      >
        <div className={styles.whole}>
          <p className={styles.description}>
            パスワード再設定のメールを送信します。
          </p>
          <div className={styles.body}>
            <TextField
              name="email"
              hintText="メールアドレス"
              errorText={this.state.errors.email}
              ref={(c) => { this.email = c }}
            />
          </div>
        </div>
      </Dialog>
    )
  }
}
