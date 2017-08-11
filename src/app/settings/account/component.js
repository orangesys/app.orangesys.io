// @flow
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react'
import { Paper, TextField, RaisedButton, FlatButton } from 'material-ui'
import Actions from './actions'
import type { State as AccountSettingsState } from './reducer'
import * as validators from './validators'
import EmailChange from './email-change'
import { User } from '../../../core'

import styles from './style.css'

type Props = {
  user: User,
  accountSettings: AccountSettingsState,
  actions: Actions,
}

type State = {
  changingEmail: boolean,
  errors: {
    [key: string]: string,
  },
}

const PROVIDER_LABELS = {
  password: 'メールアドレス',
  'google.com': 'Google',
  'github.com': 'Github',
}

export default class AccountSetting extends Component<void, Props, State> {
  props: Props
  state: State = {
    changingEmail: false,
    errors: {},
  }

  onProfileUpdate = async (e: any): Promise<void> => {
    const { actions, user } = this.props
    e.preventDefault()
    const companyName = e.target.companyName.value.trim()
    const fullName = e.target.fullName.value.trim()
    const inputValues = { companyName, fullName }
    const errors = validators.validateProfileUpdate(inputValues)
    this.setState({ errors })
    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
      return
    }
    await actions.updateProfile(user, companyName, fullName)
  }

  onEmailChange = async (inputValues: Object): Promise<void> => {
    const { actions, user } = this.props
    const errors = validators.validateEmailChange(inputValues)
    this.setState({ errors })
    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
      return
    }
    await actions.changeEmail(user, inputValues.email, inputValues.password)
  }

  startChangingEmail = () => {
    this.setState({ changingEmail: true })
  }

  cancelChangingEmail = () => {
    this.setState({ changingEmail: false })
  }

  render() {
    const { user, accountSettings } = this.props
    if (user.db == null) { return null }
    const { changingEmail } = this.state
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            <form onSubmit={this.onProfileUpdate}>
              <ul className={styles.attrs}>
                <li>
                  <TextField
                    name="companyName"
                    defaultValue={user.getCompanyName()}
                    floatingLabelText="会社名"
                    fullWidth
                    errorText={this.state.errors.companyName}
                  />
                </li>
                <li>
                  <TextField
                    name="fullName"
                    defaultValue={user.getFullName()}
                    floatingLabelText="フルネーム"
                    fullWidth
                    errorText={this.state.errors.fullName}
                  />
                </li>
              </ul>
              <div>
                <RaisedButton
                  label="更新"
                  type="submit"
                  secondary
                  disabled={accountSettings.submitting && !changingEmail}
                />
              </div>
            </form>
          </Paper>
          <Paper className={styles.paper}>
            <ul className={styles.attrs}>
              <li>
                <TextField
                  name="email"
                  value={user.getEmail()}
                  floatingLabelText="メールアドレス"
                  fullWidth
                  className={styles.email}
                  underlineShow={false}
                />
                {user.canChangeEmail &&
                  <FlatButton
                    label="メールアドレスの変更"
                    type="button"
                    secondary
                    onClick={this.startChangingEmail}
                  />
                }
              </li>
              <li className={styles.providers}>
                <label className={styles.label}>ログイン方法</label>
                <ul className={styles['provider-list']}>
                  {user.getProviderData().map(provider => (
                    <li
                      className={styles['provider-item']}
                      key={`provider-${provider.providerId}`}
                    >
                      {PROVIDER_LABELS[provider.providerId]}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </Paper>
        </div>
        <div className={styles['layout-offset-left']} />
        {changingEmail &&
          <EmailChange
            onCancel={this.cancelChangingEmail}
            onSubmit={this.onEmailChange}
            submitting={accountSettings.submitting}
            errors={this.state.errors}
          />
        }
      </div>
    )
  }
}
