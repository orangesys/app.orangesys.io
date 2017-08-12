// @flow
import React from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'
import styles from './style.css'
import { LinearProgress } from '../../../parts'

type Props = {
  onCancel: Function,
  onSubmit: Function,
  submitting: boolean,
  errors: { [key: string]: string },
}

const EmailChange = (props: Props) => {
  let email
  let password
  const { errors } = props
  const actions = [
    <FlatButton
      label="キャンセル"
      onClick={props.onCancel}
    />,
    <FlatButton
      label="送信"
      onClick={() => {
        const inputs = {
          email: email.getValue(),
          password: password.getValue(),
        }
        props.onSubmit(inputs)
      }}
      primary
      disabled={props.submitting}
    />,
  ]
  return (
    <Dialog
      actions={actions}
      modal
      title="メールアドレスの変更"
      open
      onRequestClose={props.onCancel}
    >
      <div className={styles.whole}>
        <div className={styles.body}>
          <div>
            <TextField
              name="email"
              hintText="新しいメールアドレス"
              errorText={errors.email}
              ref={(c) => { email = c }}
            />
          </div>
          <div>
            <TextField
              name="password"
              type="password"
              hintText="パスワード"
              errorText={errors.password}
              ref={(c) => { password = c }}
            />
          </div>
          {props.submitting &&
            <LinearProgress />
          }
        </div>
      </div>
    </Dialog>
  )
}

export default EmailChange
