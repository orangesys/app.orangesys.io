import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory as history } from 'react-router';
import { createSelector } from 'reselect';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { GridList, GridTile } from 'material-ui/GridList';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';

import Header from 'src/views/components/header-auth';
import { Stripe } from 'src/core/stripe';
import { findPlan, setupActions, getSetup } from 'src/core/setup';
import ErrorSnackbar from 'src/views/components/error-snackbar';
import styles from './index.css';
import visaImage from 'src/images/payment/visa-straight-32px.png';
import mcImage from 'src/images/payment/mastercard-straight-32px.png';
import amexImage from 'src/images/payment/american-express-straight-32px.png';

const cardImages = [visaImage, mcImage, amexImage];

const Payment = ({ setup, onSubmit, onMessageClose }) => {
  const { planId, submitting, paymentRegistrationError } = setup;
  const plan = findPlan(planId);
  return (
    <div>
      <Header />
      <ErrorSnackbar error={paymentRegistrationError} onClose={onMessageClose} />
      <Grid>
        <Row>
          <Col
            className={styles.navigation}
            xsOffset={1} xs={10}
            smOffset={2} sm={8}
            mdOffset={3} md={6}
          >
            <Paper className={styles.main}>
              <div className={styles.header}>
                支払い情報の入力
              </div>
              <div className={styles.body}>
                <div className={styles.plan}>
                  <Card
                    key={`setup-plan-${plan.id}`} className={styles['plan-item']}
                  >
                    <CardHeader
                      title={plan.title}
                      subtitle={`${plan.price}`}
                    />
                    <CardText>
                      <span className={styles['plan-attr']}>
                        {`データ保存期間: ${plan.retentionText}`}
                      </span>
                      <span className={styles['plan-attr']}>
                        {`ストレージ: ${plan.storage}`}
                      </span>
                    </CardText>
                    <CardActions>
                      <FlatButton
                        label="プランを変更" secondary
                        onClick={() => { history.replace('/setup/plan'); }}
                      />
                    </CardActions>
                  </Card>
                </div>
                <div className={styles.payment}>
                  <div className={styles.message}>
                    クレジットカード情報の入力が必要です。
                  </div>
                  <Row>
                    <Col
                      className={styles.navigation}
                      xsOffset={1} xs={10}
                      smOffset={3} sm={6}
                      mdOffset={4} md={4}
                    >
                      <GridList className={styles['card-logos']} cellHeight={50} cols={3}>
                        {cardImages.map((image) => (
                          <GridTile key={`grid-${image}`}>
                            <img src={image} width={16} alt="card logo" />
                          </GridTile>
                        ))}
                      </GridList>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      className={styles.navigation}
                      xsOffset={0} xs={12}
                      smOffset={0} sm={12}
                      mdOffset={0} md={12}
                    >
                      <form className={styles.form} onSubmit={onSubmit}>
                        <div className={styles['form-group']}>
                          <label className={styles.label}>カード番号</label>
                          <TextField
                            maxLength="16" fullWidth
                            inputStyle={{ letterSpacing: '0.2rem' }}
                            hintText="**** **** **** ****"
                            data-stripe="number"
                          />
                        </div>
                        <div className={styles['form-group']}>
                          <label className={styles.label}>有効期限(MM/YY)</label>
                          <div>
                            <TextField
                              maxLength="2"
                              inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                              hintText="MM"
                              style={{ width: '30px', marginRight: '10px' }}
                              className={styles.expiration}
                              data-stripe="exp-month"
                            />
                            /
                            <TextField
                              maxLength="2"
                              inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                              hintText="YY"
                              style={{ width: '30px', marginLeft: '10px' }}
                              className={styles.expiration}
                              data-stripe="exp-year"
                            />
                          </div>
                        </div>
                        <div className={styles['form-group']}>
                          <label className={styles.label}>セキュリティコード(CVC)</label>
                          <div>
                            <TextField
                              maxLength="4"
                              inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                              hintText="***"
                              style={{ width: '50px' }}
                              className={styles.expiration}
                              data-stripe="cvc"
                            />
                          </div>
                        </div>
                        <div
                          style={{ visibility: submitting ? '' : 'hidden' }}
                          className={styles.progress}
                        >
                          <LinearProgress />
                        </div>
                        <div>
                          <RaisedButton
                            type="submit" label="登録" primary fullWidth
                            disabled={submitting}
                          />
                        </div>
                      </form>
                    </Col>
                  </Row>
                </div>
              </div>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};


Payment.propTypes = {
  setup: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  onMessageClose: PropTypes.func,
};

const mapStateToProps = createSelector(
  getSetup,
  (setup) => ({ setup }),
);

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (e) => {
    e.preventDefault();
    dispatch(setupActions.startRegisteringPayment());
    const form = e.target;
    Stripe.createToken(form, (status, res) => {
      if (res.error) {
        dispatch(setupActions.stripeTokenGenerationError(res.error));
        return;
      }
      const token = res.id;
      dispatch(setupActions.registerPayment({ token }));
    });
  },
  onMessageClose: () => {
    dispatch(setupActions.clearMessage());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
