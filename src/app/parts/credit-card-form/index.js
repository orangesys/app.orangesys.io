// @flow
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react'
import { TextField, RaisedButton } from 'material-ui'
import * as CreditImages from '../../../images/credit'
import { LinearProgress } from '../progress'
import styles from './style.css'

type DefaultProps = {
  guideText: string,
}

type Props = {
  onSubmit: Function,
  submitting: boolean,
  guideText?: string,
}

type State = {
  number: string,
  expMonth: string,
  expYear: string,
  cvc: string,
}

export default class CreditCardForm extends Component<DefaultProps, Props, State> {
  props: Props
  state: State = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  }

  static defaultProps = {
    guideText: '登録にはクレジットカードの入力が必要です。',
  }

  onChangeText = (e: any) => {
    const target = e.target
    this.setState({ [target.name]: target.value })
  }

  onSubmit = async (e: any) => {
    const ok = await this.props.onSubmit(e)
    if (ok) {
      this.setState({
        number: '',
        expMonth: '',
        expYear: '',
        cvc: '',
      })
    }
  }

  render() {
    return (
      <form className={styles.whole} onSubmit={this.onSubmit}>
        <div className={styles.guide}>{this.props.guideText}</div>
        <div className={styles.logos}>
          <div key="card-image-visa">
            <img src={CreditImages.visa} width={38} height={24} alt="card logo" />
          </div>
          <div key="card-image-master">
            <img src={CreditImages.master} width={38} height={24} alt="card logo" />
          </div>
          <div key="card-image-amex">
            <img src={CreditImages.amex} width={38} height={24} alt="card logo" />
          </div>
        </div>
        <div className={styles.inputs}>
          <div className={styles['form-group']}>
            <label className={styles.label}>カード番号</label>
            <TextField
              name="number"
              maxLength="16"
              fullWidth
              inputStyle={{ letterSpacing: '0.2rem' }}
              hintText="**** **** **** ****"
              data-stripe="number"
              value={this.state.number}
              onChange={this.onChangeText}
            />
          </div>
          <div className={styles['form-group']}>
            <label className={styles.label}>有効期限(MM/YY)</label>
            <div>
              <TextField
                name="expMonth"
                maxLength="2"
                inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                hintText="MM"
                style={{ width: '30px', marginRight: '10px' }}
                className={styles.expiration}
                data-stripe="exp-month"
                value={this.state.expMonth}
                onChange={this.onChangeText}
              />
              /
              <TextField
                name="expYear"
                maxLength="2"
                inputStyle={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                hintText="YY"
                style={{ width: '30px', marginLeft: '10px' }}
                className={styles.expiration}
                data-stripe="exp-year"
                value={this.state.expYear}
                onChange={this.onChangeText}
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
                hintText="***"
                style={{ width: '50px' }}
                className={styles.expiration}
                data-stripe="cvc"
                value={this.state.cvc}
                onChange={this.onChangeText}
              />
            </div>
          </div>
          <div className={styles.action}>
            <LinearProgress on={this.props.submitting} />
            <RaisedButton
              type="submit"
              label="登録"
              primary
              fullWidth
              disabled={this.props.submitting}
            />
          </div>
        </div>
      </form>
    )
  }
}
