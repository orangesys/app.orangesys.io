import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styles from './password-reset.css';

const PasswordReset = ({ open, onCancel, onSubmit, errors }) => {
  let email;

  const onClickSendButton = e => {
    e.preventDefault();
    onSubmit(email.getValue());
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
    />,
  ];

  return (
    <Dialog
      actions={actions}
      modal
      open={open}
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
            errorText={errors.get('email')}
            ref={c => { email = c; }}
          />
        </div>
      </div>
    </Dialog>
  );
};

PasswordReset.propTypes = {
  open: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default PasswordReset;
