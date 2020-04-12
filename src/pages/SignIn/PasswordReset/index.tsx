/** @jsx jsx */
import { useState } from 'react'
import { jsx } from '@emotion/core'
import * as yup from 'yup'
import { Dialog, DialogTitle, TextField, DialogContent, DialogActions, Button } from '@material-ui/core'

interface Props {
  onCancel: () => void
  onSubmit: (email: string) => void
}

const emailSchema = yup
  .string()
  .required()
  .email()

export const PasswordReset = ({ onCancel, onSubmit }: Props) => {
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    onSubmit(email)
  }

  const isValidOfEmail = emailSchema.isValidSync(email)

  return (
    <Dialog data-cy="password-reset" open={true} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">パスワード再設定のメールを送信します</DialogTitle>

      <DialogContent>
        <TextField
          data-cy="reset-email-input"
          autoFocus
          margin="dense"
          id="email"
          name="email"
          label="メールアドレス"
          type="email"
          error={!isValidOfEmail}
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>キャンセル</Button>
        <Button data-cy="send-email" disabled={!isValidOfEmail} onClick={handleSubmit} color="primary">
          送信
        </Button>
      </DialogActions>
    </Dialog>
  )
}
