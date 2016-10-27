import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { hashHistory as history } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
// import Snackbar from 'material-ui/Snackbar';

import Header from '../../components/header-unauth';
import {
  authActions,
  getEmailVerificationParams,
  getEmailVerificationResult,
} from 'src/core/auth';
import styles from './index.css';

class Verify extends Component {
  componentWillMount() {
    const { oobCode, verifyEmail } = this.props;
    verifyEmail({ oobCode });
  }
  render() {
    const { result } = this.props;
    return (
      <div>
        <Header />
        <Grid className={styles.wrapper}>
          <Row>
            <Col
              xsOffset={1} xs={10}
              smOffset={3} sm={6}
              mdOffset={3} md={6}
              className={styles.container}
            >
              <Paper className={styles.main}>
                <div className={styles.header}>
                  メールアドレスの認証
                </div>
                <div className={styles.body}>
                  {result === 0 && <p>認証処理中です。</p> }
                  {result > 0 &&
                    <div>
                      <p>認証が完了しました。</p>
                      <div>
                        <FlatButton
                          label="次へ" secondary
                          onClick={() => { window.location.reload(); }}
                        />
                      </div>
                    </div>
                  }
                  {result < 0 && <p>認証コードが無効です。</p>}
                </div>
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Verify.propTypes = {
  oobCode: PropTypes.string,
  verifyEmail: PropTypes.func.isRequired,
  verifyingEmail: PropTypes.bool,
  result: PropTypes.number,
};

const mapStateToProps = createSelector(
  getEmailVerificationParams,
  getEmailVerificationResult,
  (params, result) => ({ oobCode: params.oobCode, result }),
);

const mapDispatchToProps = (dispatch) => ({
  verifyEmail: (params) => {
    dispatch(authActions.verifyEmail(params));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
