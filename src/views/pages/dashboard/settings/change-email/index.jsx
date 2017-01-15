import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styles from './index.css';

const ChangeEmail = ({ open, onCancel, onSubmit, submitting, errors = {} }) => {
  let email;
  let password;
  const onClickSendButton = e => {
    e.preventDefault();
    const inputs = {
      email: email.getValue(),
      password: password.getValue(),
    };
    onSubmit(inputs);
  };
  const actions = [
    <FlatButton
      label="キャンセル"
      onClick={onCancel}
    />,
    <FlatButton
      label="送信"
      onClick={onClickSendButton}
      primary
      disabled={submitting}
    />,
  ];
  return (
    <Dialog
      actions={actions}
      modal
      title="メールアドレスの変更"
      open={open}
      onRequestClose={onCancel}
    >
      <div className={styles.whole}>
        <div className={styles.body}>
          <div>
            <TextField
              name="email"
              hintText="新しいメールアドレス"
              ref={c => { email = c; }}
              errorText={errors.get('email')}
            />
          </div>
          <div>
            <TextField
              name="password"
              type="password"
              hintText="パスワード"
              ref={c => { password = c; }}
              errorText={errors.get('password')}
            />
          </div>

        </div>
      </div>
    </Dialog>
  );
};

ChangeEmail.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  errors: PropTypes.object,
};

export default ChangeEmail;
