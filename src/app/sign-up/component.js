// @flow
import React, { Component } from 'react'
import {
  TextField,
  RaisedButton,
  FlatButton,
  FontIcon,
  LinearProgress,
} from 'material-ui'
import moment from 'moment'

import Actions from './actions'
import * as validators from './validator'
import PaperWithTitle from '../parts/paper-with-title'
import { User } from '../../core'
import styles from './styles.css'
import type { InputFieldsForOAuth, InputFieldsWithPassword } from './index'
import type { State as SignUpState } from './reducer'
import type { RouterProp } from '../../lib/router'
import type { ProviderId } from '../../core'

type Props = {
  actions: Actions,
  signUp: SignUpState,
  router: RouterProp,
  user: User,
}

type State = {
  companyName: string,
  fullName: string,
  email: string,
  password: string,
  errors: {
    [key: string]: string,
  }
}

export default class SignUp extends Component<void, Props, State> {
  state: State
  props: Props

  state = {
    companyName: '',
    fullName: '',
    email: '',
    password: '',
    errors: {},
  }

  componentWillMount() {
    const { signUp, user } = this.props
    // in case when redirected from sign-in screen
    if (signUp.signingUpWithOAuth && user.email) {
      this.setState({
        fullName: user.displayName || '',
        email: user.email || '',
      })
    }
  }

  onGoToSignIn = () => {
    this.props.router.redirectTo('/sign-in')
  }

  onChange = (e: SyntheticInputEvent): void => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  onSubmit = async (e: SyntheticInputEvent): Promise<void> => {
    e.preventDefault()
    if (this.props.signUp.signingUpWithOAuth) {
      this.signUpWithOAuth()
    } else {
      this.signUpWithPassword()
    }
  }

  async signUpWithOAuth() {
    const { actions, router } = this.props
    this.setState({ errors: {} })
    const fields: InputFieldsForOAuth = {
      companyName: this.state.companyName,
      fullName: this.state.fullName,
    }
    const errors = validators.validateSignUpWithOAuth(fields)
    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
      return
    }
    await actions.signUpWithOAuth({
      companyName: this.state.companyName,
      fullName: this.state.fullName,
      email: this.state.email,
    })
    router.redirectTo('/')
  }

  async signUpWithPassword() {
    const { actions, router } = this.props
    this.setState({ errors: {} })
    const fields: InputFieldsWithPassword = {
      companyName: this.state.companyName,
      fullName: this.state.fullName,
      email: this.state.email,
      password: this.state.password,
    }
    const errors = validators.validateSignUpWithEmailAndPassword(fields)
    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
      return
    }
    await actions.signUpWithPassword(fields.password, {
      companyName: fields.companyName,
      fullName: fields.fullName,
      email: fields.email,
      createdAt: moment().utc().format(),
    })
    router.redirectTo('/')
  }

  async connectToOAuth(e: SyntheticInputEvent, providerId: ProviderId) {
    e.preventDefault()
    this.setState({ errors: {} })
    const user = await this.props.actions.connectToOAuthProvider(providerId)
    if (user == null) { return }
    const alreadyExists = !!user.db
    if (alreadyExists) {
      this.props.router.redirectTo('/')
      return
    }
    this.setState({
      fullName: user.displayName || '',
      email: user.email || '',
      password: '',
    })
  }

  conenctToGoogle = async (e: SyntheticInputEvent) => {
    this.connectToOAuth(e, 'google.com')
  }
  connectToGithub = async (e: SyntheticInputEvent) => {
    this.connectToOAuth(e, 'github.com')
  }

  get submitText(): string {
    const { signUp } = this.props
    const { signingUpWithOAuth, providerId } = signUp
    if (signingUpWithOAuth && providerId) {
      const mapping = {
        'google.com': 'Googleアカウントで登録',
        'github.com': 'Githubアカウントで登録',
      }
      const text = mapping[providerId]
      if (text) { return text }
    }
    return 'メールアドレスで登録'
  }

  render() {
    const { signUp } = this.props
    const oauth = signUp.signingUpWithOAuth
    const {
      companyName,
      fullName,
      email,
      password,
      errors,
    } = this.state
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset']} />
        <div className={styles['layout-main']}>
          <div className={styles.navigation}>
            <FlatButton
              label="既にアカウントをお持ちの方"
              secondary
              onClick={this.onGoToSignIn}
              icon={<FontIcon className="fa fa-sign-in" />}
            />
          </div>
          <PaperWithTitle title={oauth ? '外部アカウントで登録' : '新規ユーザ登録'}>
            <div className={styles.main}>
              <form className={styles.form} onSubmit={this.onSubmit}>
                <div className={styles.control}>
                  <TextField
                    name="companyName"
                    hintText="会社名"
                    value={companyName}
                    onChange={this.onChange}
                    errorText={errors.companyName}
                    fullWidth
                  />
                </div>
                <div className={styles.control}>
                  <TextField
                    name="fullName"
                    hintText="名前 (フルネーム)"
                    value={fullName}
                    onChange={this.onChange}
                    errorText={errors.fullName}
                    fullWidth
                  />
                </div>
                <div className={styles.control}>
                  <TextField
                    name="email"
                    hintText="メールアドレス"
                    value={email}
                    onChange={this.onChange}
                    errorText={errors.email}
                    fullWidth
                    disabled={oauth}
                  />
                </div>
                {!oauth &&
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
                }
                <div className={styles.register}>
                  {signUp.submitting &&
                    <div className={styles.progress}>
                      <LinearProgress />
                    </div>
                  }
                  <RaisedButton
                    primary
                    label={this.submitText}
                    type="submit"
                    disabled={signUp.submitting}
                    fullWidth
                  />
                </div>
                {!oauth &&
                  <div>
                    <div className={styles.external}>
                      <p className={styles['external-label']}>外部アカウントで登録</p>
                      <div className={styles['external-actions']}>
                        <div className={styles['external-sign-up']}>
                          <RaisedButton
                            label="Google"
                            disabled={signUp.submitting}
                            fullWidth
                            icon={<FontIcon className="fa fa-google" />}
                            onClick={this.conenctToGoogle}
                          />
                        </div>
                        <div className={styles['external-sign-up']}>
                          <RaisedButton
                            label="Github"
                            disabled={signUp.submitting}
                            fullWidth
                            icon={<FontIcon className="fa fa-github" />}
                            onClick={this.connectToGithub}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </form>
            </div>
          </PaperWithTitle>
        </div>
        <div className={styles['layout-offset']} />
      </div>
    )
  }
}
