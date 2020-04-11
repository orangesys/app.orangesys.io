/** @jsx jsx */
import { useContext } from 'react'
import { jsx } from '@emotion/core'
import { Snackbar } from '@material-ui/core'
import { Alert as MuiAlert } from '@material-ui/lab'
import ERRORS from 'const/errors'
import { GlobalMessageContext } from 'contexts/GlobalMessage'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const GlobalMessage = () => {
  const { open, type, message, setGlobalMessage } = useContext(GlobalMessageContext)

  const onClose = () => {
    setGlobalMessage({
      open: false,
      type,
      message,
    })
  }

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert severity={type} onClose={onClose}>
        {type !== 'error' && message}
        {type === 'error' && ERRORS[message]}
      </Alert>
    </Snackbar>
  )
}
