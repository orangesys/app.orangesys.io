// @flow
import React, { Component } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
  CircularProgress,
  LinearProgress,
  FlatButton,
  Dialog,
} from 'material-ui'
import { User, Info } from '../../../core'
import type { Plan } from '../../../core'
import Actions from './actions'
import type { State as PlanState } from './reducer'
import styles from './style.css'

type Props = {
  actions: Actions,
  user: User,
  plan: PlanState,
}

type State = {
  showingPlanCancelMessage: boolean,
}


export default class PlanPage extends Component<void, Props, State> {
  props: Props
  state: State = {
    showingPlanCancelMessage: false,
  }

  componentWillMount() {
    if (this.props.plan.storageUsage) { return }
    (async () => this.fetchStorageUsage())()
  }

  async fetchStorageUsage() {
    const { actions, user } = this.props
    await actions.fetchStorageUsage(user)
  }

  get plan(): Plan {
    return this.props.user.getPlan()
  }

  get storageUsageGB(): ?string {
    const { storageUsage } = this.props.plan
    if (storageUsage == null) { return null }
    return (storageUsage / 1024 / 1024 / 1024).toFixed(1)
  }

  get storageUsagePercentage(): number {
    const { storageUsage } = this.props.plan
    if (storageUsage == null) { return 0 }
    return parseInt(
      ((storageUsage / this.plan.storageByte) * 100).toFixed(),
      10,
    )
  }

  get fetching(): boolean {
    return this.props.plan.fetching
  }

  showPlanCancelMessage = () => {
    this.setState({ showingPlanCancelMessage: true })
  }

  hidePlanCancelMessage = () => {
    this.setState({ showingPlanCancelMessage: false })
  }

  render() {
    if (!this.props.user.authenticated) { return null }
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            <div className={styles.header}>
              {this.plan.title}
            </div>
            <div>
              <Table selectable={false}>
                <TableBody displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn style={{ width: 150 }}>月額</TableRowColumn>
                    <TableRowColumn>
                      <strong>
                        <span className={styles.price}>¥{this.plan.price}</span>
                         / 月 (税抜)
                      </strong>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>データ保存期間</TableRowColumn>
                    <TableRowColumn>
                      <strong>{this.plan.retentionText}</strong>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      Storage使用量
                    </TableRowColumn>
                    <TableRowColumn>
                      {!this.fetching ?
                        <div>
                          <p>
                            <span className={styles.usage}>
                              {this.storageUsageGB} GB
                            </span>
                             /
                            <span className={styles.total}>10 GB</span>
                          </p>
                          <LinearProgress mode="determinate" value={this.storageUsagePercentage} />
                        </div>
                        :
                        <div className={styles.checking}>
                          <p className={styles['checking-text']}>使用量を確認中...</p>
                          <CircularProgress
                            size={18}
                            thickness={1.5}
                            className={styles['checking-progress']}
                          />
                        </div>
                      }
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
              onClick={this.showPlanCancelMessage}
            />
          </div>
        </div>
        <div className={styles['layout-offset-left']} />

        <Dialog
          title="プランの解約"
          open={this.state.showingPlanCancelMessage}
          onRequestClose={this.hidePlanCancelMessage}
        >
          <div className={styles['cancel-message']}>
            プランの解約は
            <a className={styles['support-email']} href={`mailto:${Info.supportEmail}`}>
              {Info.supportEmail}
            </a>
            までお問い合わせください。
          </div>
        </Dialog>
      </div>
    )
  }

}
