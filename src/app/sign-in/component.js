// @flow
import React, { Component } from 'react'
import {
  FlatButton,
  RaisedButton,
  FontIcon,
  TextField,
  LinearProgress,
} from 'material-ui'
import PasswordResetIcon from 'material-ui/svg-icons/content/mail'
import * as validators from './validator'
import Actions from './actions'
import type { State as SignInState } from './reducer'
import styles from './styles.css'
import PasswordReset from './password-reset'
import PaperWithTitle from '../parts/paper-with-title'
import type { RouterProp } from '../../lib/router'
import styleProps from '../../variables.css'

type SignInFields = {
  email: string,
  password: string,
}

type State = {
  email: string,
  password: string,
  errors: {
    [key: string]: string,
  },
  showingPasswordReset: boolean
}

type Props = {
  signIn: SignInState,
  actions: Actions,
  router: RouterProp,
}

export default class SignInComponent extends Component<void, Props, State> {
  props: Props
  state: State = {
    email: '',
    password: '',
    errors: {},
    showingPasswordReset: false,
  }

  onClickPasswordReset = (): void => {
    this.setState({ showingPasswordReset: true })
  }

  onCancelPasswordReset = (): void => {
    this.setState({ showingPasswordReset: false })
  }

  onChange = (e: SyntheticInputEvent): void => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  onSubmitPasswordReset = async (email: string): Promise<void> => {
    await this.props.actions.resetPassword(email)
    this.setState({ showingPasswordReset: false })
  }

  onSubmit = async (e: SyntheticInputEvent): Promise<void> => {
    e.preventDefault()
    this.setState({ errors: {} })
    const { actions, router } = this.props
    const fields: SignInFields = {
      email: this.state.email,
      password: this.state.password,
    }
    const errors = validators.validateSignInWithPassword(fields)
    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
      return
    }

    const user = await actions.signInWithPassword(fields.email, fields.password)
    if (!user || !user.authenticated) {
      return
    }
    router.redirectTo('/')
  }

  onGoToSignUp = () => {
    this.props.router.redirectTo('/sign-up')
  }
  signInWithGoogle = async () => {
    const user = await this.props.actions.signInWithOAuth('google.com')
    if (user && user.authenticated) {
      this.props.router.redirectTo('/')
      return
    }
    this.props.router.redirectTo('/sign-up')
  }
  signInWithGithub = async () => {
    await this.props.actions.signInWithOAuth('github.com')
  }
  render() {
    const { signIn } = this.props
    const { email, password, errors, showingPasswordReset } = this.state
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset']} />
        <div className={styles['layout-main']}>
          <div className={styles.navigation}>
            <FlatButton
              label="新規アカウント登録へ"
              secondary
              onClick={this.onGoToSignUp}
              icon={<FontIcon className="fa fa-user" />}
            />
          </div>
          <PaperWithTitle title="ログイン">
            <div className={styles.main}>
              <form className={styles.form} onSubmit={this.onSubmit}>
                <div className={styles.control}>
                  <TextField
                    name="email"
                    hintText="メールアドレス"
                    value={email}
                    onChange={this.onChange}
                    errorText={errors.email}
                    fullWidth
                  />
                </div>
                <div className={styles.control}>
                  <TextField
                    name="password"
                    type="password"
                    hintText="パスワード"
                    value={password}
                    onChange={this.onChange}
                    errorText={errors.password}
                    fullWidth
                  />
                </div>
                <div className={styles.register}>
                  {signIn.submitting &&
                    <div className={styles.progress}>
                      <LinearProgress color={styleProps['--colorPrimary2']} />
                    </div>
                  }
                  <RaisedButton
                    primary
                    label="メールアドレスでログイン"
                    type="submit"
                    fullWidth
                    disabled={signIn.submitting}
                  />
                </div>
                <div>
                  <div className={styles.external}>
                    <p className={styles['external-label']}>外部アカウントでログイン</p>
                    <div className={styles['external-actions']}>
                      <div className={styles['external-sign-up']}>
                        <RaisedButton
                          label="Google"
                          disabled={signIn.submitting}
                          fullWidth
                          icon={<FontIcon className="fa fa-google" />}
                          onClick={this.signInWithGoogle}
                        />
                      </div>
                      <div className={styles['external-sign-up']}>
                        <RaisedButton
                          label="Github"
                          disabled={signIn.submitting}
                          fullWidth
                          icon={<FontIcon className="fa fa-github" />}
                          onClick={this.signInWithGithub}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </PaperWithTitle>
          <div className={styles['password-reset']}>
            <FlatButton
              label="パスワード再設定"
              secondary
              onClick={this.onClickPasswordReset}
              icon={<PasswordResetIcon />}
            />
          </div>
        </div>
        <div className={styles['layout-offset']} />
        {showingPasswordReset &&
          <PasswordReset
            onCancel={this.onCancelPasswordReset}
            onSubmit={this.onSubmitPasswordReset}
          />
        }
      </div>
    )
  }
}
