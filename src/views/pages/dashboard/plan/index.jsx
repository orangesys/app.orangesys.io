import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { getPlanId } from 'src/core/auth';
import { findPlan } from 'src/core/plans';
import {
  getPlanCancel,
  dashboardActions,
  getStorageUsage,
} from 'src/core/dashboard';
import { supportEmail } from 'src/core/common-info';

import styles from './index.css';

const Plan = (props) => {
  const {
    planId,
    storageUsage,
    confirmingPlanCancel,
    showCancelInformation,
    hideCancelInformation } = props;
  const plan = findPlan(planId);
  const storageUsageGB = (storageUsage / 1024 / 1024 / 1024).toFixed(1);
  const storageUsagePercentage = parseInt(
    ((storageUsage / plan.storageByte) * 100).toFixed(), 10);
  return (
    <div className={styles.whole}>
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
                    <TableRowColumn style={{ width: 150 }}>月額</TableRowColumn>
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
                {storageUsage !== -1 ?
                  <TableRow>
                    <TableRowColumn>
                      Storage使用量
                    </TableRowColumn>
                    <TableRowColumn>
                      <p>
                        <span className={styles.usage}>
                          {storageUsageGB}GB
                        </span>
                         /
                        <span className={styles.total}>{plan.storage}</span>
                      </p>
                      <LinearProgress mode="determinate" value={storageUsagePercentage} />
                    </TableRowColumn>
                  </TableRow>
                  : null
                }
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
    </div>
  );
};

Plan.propTypes = {
  planId: PropTypes.string.isRequired,
  storageUsage: PropTypes.number,
  confirmingPlanCancel: PropTypes.bool,
  showCancelInformation: PropTypes.func.isRequired,
  hideCancelInformation: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getPlanId,
  getPlanCancel,
  getStorageUsage,
  (planId, { confirmingPlanCancel }, storageUsage) =>
  ({ planId, confirmingPlanCancel, storageUsage }),
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
