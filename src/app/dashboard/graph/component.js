// @flow
import React from 'react'
import { Paper, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'
import { User } from '../../../core'

import styles from './style.css'

type Props = {
  user: User,
}

const Graph = (props: Props) => {
  const { user } = props
  const { consumerId } = user.getApiSecrets()
  const grafanaUrl = `https://${consumerId}.g.orangesys.io`
  return (
    <div className={styles.whole}>
      <div className={styles['layout-offset-left']} />
      <div className={styles['layout-main']}>
        <Paper className={styles.paper}>
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>URL</TableRowColumn>
                <TableRowColumn>
                  <a href={grafanaUrl}>{grafanaUrl}</a>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>username</TableRowColumn>
                <TableRowColumn>
                  <strong>admin</strong>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>password</TableRowColumn>
                <TableRowColumn>
                  <strong>{consumerId && new Buffer(consumerId).toString('base64')}</strong>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
      <div className={styles['layout-offset-left']} />
    </div>
  )
}

export default Graph
