import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory as history } from 'react-router';
import { createSelector } from 'reselect';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';


import Header from '../../components/header-unauth';
import {
  authActions,
  getEmailActionParams,
  getRecoverEmailStatus,
  getProfile,
} from 'src/core/auth';
import styles from './index.css';

class RecoverEmail extends Component {
  componentWillMount() {
    const { oobCode, recoverEmail, status } = this.props;
    if (status === 0) {
      recoverEmail({ oobCode });
    }
  }
  render() {
    const { email, status } = this.props;
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
                  メールアドレスの変更取り消し
                </div>
                <div className={styles.body}>
                  {status === 1 ?
                    <p>処理中です。</p>
                    : null
                  }
                  {status === 2 ?
                    <div>
                      <p>
                        メールアドレスの変更を取り消しました。
                      </p>
                      <p>
                        現在のメールアドレス: {email}
                      </p>
                      <div>
                        <FlatButton
                          label="TOPへ" secondary
                          onClick={() => { location.href = '/'; }}
                        />
                      </div>
                    </div>
                    : null
                  }
                  {status === 9 ?
                    <p>認証コードが無効です。</p>
                    : null
                  }
                </div>
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

RecoverEmail.propTypes = {
  oobCode: PropTypes.string,
  recoverEmail: PropTypes.func.isRequired,
  status: PropTypes.number,
  email: PropTypes.string,
};

const mapStateToProps = createSelector(
  getEmailActionParams,
  getRecoverEmailStatus,
  getProfile,
  (params, status, { email }) => ({
    oobCode: params.oobCode, mode: params.mode, status, email,
  }),
);

const mapDispatchToProps = (dispatch) => ({
  recoverEmail: ({ oobCode }) => {
    dispatch(authActions.recoverEmail({ oobCode }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RecoverEmail);
