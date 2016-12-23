import React, { PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';

const backgroundColor =
  getComputedStyle(document.documentElement)
    .getPropertyValue('--errorBackgroundColor');

const ErrorSnackbar = ({ error, onClose }) => (
  <Snackbar
    open={!!error}
    message={error || ''}
    autoHideDuration={5000}
    bodyStyle={{ backgroundColor }}
    onRequestClose={onClose}
  />
);

ErrorSnackbar.propTypes = {
  error: PropTypes.string,
  onClose: PropTypes.func,
};

export default ErrorSnackbar;
