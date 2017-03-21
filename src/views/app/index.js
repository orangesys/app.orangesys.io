import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getAuth } from 'src/core/auth';
import muiTheme from './theme';
import styles from './index.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  static propTypes = {
    auth: PropTypes.object,
    children: PropTypes.object,
    signOut: PropTypes.func,
  };

  componentWillReceiveProps() {
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={styles.main}>
          <main>{this.props.children}</main>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = createSelector(
  getAuth,
  auth => ({ auth })
);

export default connect(
  mapStateToProps,
)(App);
