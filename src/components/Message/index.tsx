/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Snackbar } from '@material-ui/core'
import { Alert as MuiAlert } from '@material-ui/lab'
import ERRORS from 'const/errors'
import { SyntheticEvent } from 'react'

type Props = {
  open: boolean
  type: 'success' | 'info' | 'error' | 'warning'
  message: string
  onClose?: ((event: SyntheticEvent<any, Event>, reason: string) => void) | undefined
  autoHideDuration?: number | undefined
}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const Message = ({ open, type, message, onClose, autoHideDuration = 4000 }: Props) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <Alert severity={type} onClose={onClose}>
        {type === 'info' && message}
        {type === 'error' && ERRORS[message]}
      </Alert>
    </Snackbar>
  )
}
