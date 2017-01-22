import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Stripe } from 'src/core/stripe';
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import { GridList, GridTile } from 'material-ui/GridList';
import { settingsActions, getSettings } from 'src/core/settings';
import visaImage from 'src/images/payment/visa-straight-32px.png';
import mcImage from 'src/images/payment/mastercard-straight-32px.png';
import amexImage from 'src/images/payment/american-express-straight-32px.png';
const cardImages = [visaImage, mcImage, amexImage];


import styles from './index.css';

const Payment = ({ creditCardFields, onChangeField, submitting, onSubmit }) => {
  const { number, expMonth, expYear, cvc } = creditCardFields.toJS()
  return (
    <div>
      <div className={styles.whole}>
        <Grid>
          <Row>
            <Col md={6} sm={10} xs={12}>
              <Paper>
                <div className={styles.body}>
                  <p className={styles.message}>
                    クレジットカード情報を更新します。
                  </p>
                  <GridList className={styles['card-logos']} cellHeight={50} cols={3}>
                    {cardImages.map((image) => (
                      <GridTile key={`grid-${image}`}>
                        <img src={image} width={16} alt="card logo" />
                      </GridTile>
                    ))}
                  </GridList>
                  <form className={styles.form} onSubmit={onSubmit}>
                    <div className={styles['form-group']}>
                      <label className={styles.label}>カード番号</label>
                      <TextField
                        name="number"
                        maxLength="16" fullWidth
                        inputStyle={{ letterSpacing: '0.2rem' }}
                        hintText={number || '**** **** **** ****'}
                        data-stripe="number"
                        onChange={onChangeField}
                        value={number || ''}
                      />
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles.label}>有効期限(MM/YY)</label>
                      <div>
                        <TextField
                          name="expMonth"
                          maxLength="2"
                          inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                          hintText={expMonth || 'MM'}
                          style={{ width: '30px', marginRight: '10px' }}
                          className={styles.expiration}
                          data-stripe="exp-month"
                          onChange={onChangeField}
                          value={expMonth || ''}
                        />
                        /
                        <TextField
                          name="expYear"
                          maxLength="2"
                          inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                          hintText={expYear || 'YY'}
                          style={{ width: '30px', marginLeft: '10px' }}
                          className={styles.expiration}
                          data-stripe="exp-year"
                          onChange={onChangeField}
                          value={expYear || ''}
                        />
                      </div>
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles.label}>セキュリティコード(CVC)</label>
                      <div>
                        <TextField
                          name="cvc"
                          maxLength="4"
                          inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                          hintText={cvc || '***'}
                          style={{ width: '50px' }}
                          className={styles.expiration}
                          data-stripe="cvc"
                          onChange={onChangeField}
                          value={cvc || ''}
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
                        type="submit" label="クレジットカード情報を更新" primary fullWidth
                        disabled={submitting}
                      />
                    </div>
                  </form>
                </div>
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
};

Payment.propTypes = {
  creditCardFields: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onChangeField: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getSettings,
  ({ creditCardFields, submitting }) => ({ creditCardFields, submitting }),
);

const mapDispatchToProps = (dispatch) => ({
  onChangeField: ({ target }) => {
    const payload = {
      name: target.name,
      value: target.value,
    };
    dispatch(settingsActions.changeCreditCardField(payload));
  },
  onSubmit: (e) => {
    e.preventDefault();
    dispatch(settingsActions.startChangingCreditCard());
    const form = e.target;
    Stripe.createToken(form, (status, res) => {
      if (res.error) {
        dispatch(settingsActions.stripeTokenGenerationError(res.error));
        return;
      }
      const token = res.id;
      dispatch(settingsActions.changeCreditCard({ token }));
    });
  },
});
//
export default connect(mapStateToProps, mapDispatchToProps)(Payment);
