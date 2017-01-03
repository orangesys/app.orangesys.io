import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { hashHistory as history } from 'react-router';

import Header from '../../components/header-unauth';
import {
  getEmailActionParams,
} from 'src/core/auth';

class EmailAction extends Component {
  componentWillMount() {
    const { oobCode, mode } = this.props;
    const pathMap = {
      verifyEmail: '/verify-email',
      resetPassword: '/reset-password',
    };
    history.replace({ pathname: pathMap[mode], query: { oobCode } });
  }
  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

EmailAction.propTypes = {
  mode: PropTypes.string,
  oobCode: PropTypes.string,
};

const mapStateToProps = createSelector(
  getEmailActionParams,
  (params) => ({ oobCode: params.oobCode, mode: params.mode }),
);

export default connect(mapStateToProps)(EmailAction);
