import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import Header from '../../components/header-unauth';
import { getEmailVerification, authActions } from 'src/core/auth';
import styles from './index.css';

const VerificationGuide = ({ emailVerification, onSendEmail, onGoToNext }) => {
  const { sendingVerificationEmail, sentVerificationEmail } = emailVerification;
  return (
    <div>
      <Header />
      <Snackbar
        open={sentVerificationEmail}
        message="確認メールを再送信しました。"
        autoHideDuration={4000}
      />
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
                <p>送信された認証用メールを確認してください。</p>
                <div className={styles['send-mail']}>
                  <FlatButton
                    label="確認メールを再度送信"
                    primary disabled={sendingVerificationEmail}
                    onClick={onSendEmail}
                  />
                </div>
              </div>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

VerificationGuide.propTypes = {
  emailVerification: PropTypes.object,
  onSendEmail: PropTypes.func.isRequired,
  onGoToNext: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getEmailVerification,
  (emailVerification) => ({ emailVerification }),
);

const mapDispatchToProps = (dispatch) => ({
  onSendEmail: () => {
    dispatch(authActions.emailVerification());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationGuide);
