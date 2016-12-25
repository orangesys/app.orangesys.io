import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { authActions } from 'src/core/auth';
// import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
// import styles from './index.css';

const HeaderAuth = ({ onSignOut }) => (
  <AppBar
    title="Orangesys"
    showMenuIconButton={false}
    iconElementRight={
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="Sign out" onTouchTap={onSignOut} />
      </IconMenu>
    }
  />
);

HeaderAuth.propTypes = {
  onSignOut: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onSignOut: () => {
    dispatch(authActions.signOut());
  },
});

export default connect(null, mapDispatchToProps)(HeaderAuth);
