/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Dialog, DialogTitle, TextField, DialogContent, DialogActions, Button } from '@material-ui/core'
import { useState } from 'react'

interface Props {
  onCancel: () => void
  onSubmit: (email: string) => void
}

export const PasswordReset = ({ onCancel, onSubmit }: Props) => {
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    onSubmit(email)
  }

  return (
    <Dialog open={true} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">パスワード再設定のメールを送信します</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          name="email"
          label="メールアドレス"
          type="email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>キャンセル</Button>
        <Button onClick={handleSubmit} color="primary">
          送信
        </Button>
      </DialogActions>
    </Dialog>
  )
}
