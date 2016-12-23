import React, { PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';
import { getCSSPropertyOf } from 'src/views/utils';

const Message = ({ message, onClose }) => (
  <Snackbar
    open={!!message}
    message={message || ''}
    autoHideDuration={4000}
    bodyStyle={{ backgroundColor: getCSSPropertyOf('--accent1Color') }}
    onRequestClose={onClose}
  />
);

Message.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func,
};

export default Message;
