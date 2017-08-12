// @flow
import React, { Component } from 'react'
import { Paper, TextField, RaisedButton } from 'material-ui'
import Actions from './actions'
import type { State as InquiryState } from './reducer'
import * as validators from './validator'
import { LinearProgress } from '../../parts'
import { User } from '../../../core'
import styles from './style.css'

type Props = {
  user: User,
  inquiry: InquiryState,
  actions: Actions,
}

type State = {
  body: string,
  errors: {
    [key: string]: string,
  },
}

export default class Inquiry extends Component<void, Props, State> {
  props: Props
  state: State = {
    body: '',
    errors: {},
  }

  onBodyChange = (e: SyntheticInputEvent): void => {
    e.preventDefault()
    this.setState({ body: e.target.value })
  }

  onSubmit = async (e: SyntheticInputEvent) => {
    e.preventDefault()
    const { user, actions } = this.props
    const inputField = { body: this.state.body }
    const errors = validators.validateInquiry(inputField)
    this.setState({ errors })
    if (Object.keys(errors).length > 0) {
      return
    }
    const succeeded = await actions.sendInquiry(user.getId(), this.state.body)
    if (succeeded) {
      this.setState({ body: '' })
    }
  }

  render() {
    const { inquiry } = this.props
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            <form onSubmit={this.onSubmit}>
              <p className={styles.hint}>
                お問い合わせ内容を入力してください。
              </p>
              <TextField
                name="body"
                value={this.state.body}
                fullWidth
                multiLine
                rows={5}
                hintText=""
                onChange={this.onBodyChange}
                errorText={this.state.errors.body}
              />
              <div className={styles.action}>
                {inquiry.submitting &&
                  <LinearProgress />
                }
                <RaisedButton
                  label="お問い合わせ内容を送信する"
                  primary
                  fullWidth
                  disabled={this.props.inquiry.submitting}
                  type="submit"
                />
              </div>
            </form>
          </Paper>
        </div>
        <div className={styles['layout-offset-left']} />
      </div>
    )
  }
}
