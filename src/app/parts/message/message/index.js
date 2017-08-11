// @flow

import React from 'react'
import { Snackbar } from 'material-ui'
import css from '../../../../variables.css'

type Props = {
  message: ?string,
  autoHideDuration?: number,
  onClose: Function,
}
const Message = ({ message, onClose, autoHideDuration }: Props) => (
  <Snackbar
    open={!!message}
    message={message || ''}
    autoHideDuration={autoHideDuration}
    bodyStyle={{ backgroundColor: css['--colorPrimary2'] }}
    onRequestClose={onClose}
  />
)

Message.defaultProps = {
  autoHideDuration: 7000,
}

export default Message
