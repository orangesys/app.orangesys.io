import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { getPlanId } from 'src/core/auth';
import { findPlan } from 'src/core/plans';
import { getPlanCancel, dashboardActions } from 'src/core/dashboard';
import { supportEmail } from 'src/core/common-info';

import styles from './index.css';

const Plan = ({ planId, confirmingPlanCancel, showCancelInformation, hideCancelInformation }) => {
  const plan = findPlan(planId);
  return (
    <div className={styles.whole}>
      <Grid>
        <Row>
          <Col md={8} sm={10} xs={12}>
            <Paper className={styles.main} zDepth={1}>
              <div className={styles.header}>
                {plan.title}
              </div>
              <div>
                <Table selectable={false}>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn>月額</TableRowColumn>
                      <TableRowColumn>
                        <strong>
                          <span className={styles.price}>¥{plan.price}</span>
                           / 月 (税抜)
                        </strong>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>データ保存期間</TableRowColumn>
                      <TableRowColumn>
                        <strong>{plan.retentionText}</strong>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>ストレージ</TableRowColumn>
                      <TableRowColumn>
                        <strong>{plan.storage}</strong>
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Paper>
            <div className={styles.actions}>
              <FlatButton
                label="プランの解約"
                secondary
                onClick={showCancelInformation}
              />
            </div>
          </Col>
          {confirmingPlanCancel ?
            <Dialog
              title="プランの解約"
              open={confirmingPlanCancel}
              onRequestClose={hideCancelInformation}
            >
              <div className={styles['cancel-message']}>
                プランの解約は
                <a className={styles['support-email']} href={`mailto:${supportEmail}`}>
                  {supportEmail}
                </a>
                までお問い合わせください。
              </div>
            </Dialog>
            : null
          }
        </Row>
      </Grid>
    </div>
  );
};

Plan.propTypes = {
  planId: PropTypes.string.isRequired,
  confirmingPlanCancel: PropTypes.bool,
  showCancelInformation: PropTypes.func.isRequired,
  hideCancelInformation: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getPlanId,
  getPlanCancel,
  (planId, { confirmingPlanCancel }) => ({ planId, confirmingPlanCancel }),
);

const mapDispatchToProps = (dispatch) => ({
  showCancelInformation: () => {
    dispatch(dashboardActions.confirmPlanCancel());
  },
  hideCancelInformation: () => {
    dispatch(dashboardActions.cancelPlanCancel());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
