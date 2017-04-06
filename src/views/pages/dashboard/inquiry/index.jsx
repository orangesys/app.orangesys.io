import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getInquiry, getFormInfo, dashboardActions } from 'src/core/dashboard';

import styles from './index.css';

const Inquiry = (props) => {
  const {
    inquiry,
    fieldErrors,
    submitting,
    onInqueryBodyChange,
    onSubmit,
  } = props;
  return (
    <div className={styles.whole}>
      <Row>
        <Col md={6} sm={10} xs={12}>
          <Paper className={styles.paper}>
            <form onSubmit={onSubmit}>
              <p className={styles.hint}>
                お問い合わせ内容を入力してください。
              </p>
              <TextField
                name="body"
                value={inquiry.get('body')}
                fullWidth
                multiLine
                rows={5}
                hintText=""
                onChange={onInqueryBodyChange}
                errorText={fieldErrors.get('body')}
              />
              <RaisedButton
                label="お問い合わせ内容を送信する"
                primary
                fullWidth
                className={styles.submit}
                disabled={submitting}
                type="submit"
              />
            </form>
          </Paper>
        </Col>
      </Row>
    </div>
  );
};

Inquiry.propTypes = {
  inquiry: PropTypes.object,
  fieldErrors: PropTypes.object,
  submitting: PropTypes.bool,
  onInqueryBodyChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getInquiry,
  getFormInfo,
  (inquiry, { fieldErrors, submitting }) => ({ inquiry, fieldErrors, submitting }),
);

const mapDispatchToProps = (dispatch) => ({
  onInqueryBodyChange: (e) => {
    dispatch(dashboardActions.inqueryBodyChanged(e.target.value));
  },
  onSubmit: (e) => {
    e.preventDefault();
    dispatch(dashboardActions.sendInquiry());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Inquiry);
