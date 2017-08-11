// @flow
import React, { Component } from 'react'
import {
  FontIcon,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
  TextField,
  IconButton,
} from 'material-ui'
import CopyToClipboard from 'react-copy-to-clipboard'
import type { Dispatch } from 'redux'
import { User } from '../../../core'
import type { ApiSecrets } from '../../../core'
import { ACTION_TYPES } from '../../common/message'


import styles from './style.css'

import cssProps from '../../../variables.css'

type Props = {
  user: User,
  dispatch: Dispatch,
}


export default class Graph extends Component<void, Props, void> {
  props: Props

  onCopy = () => {
    const message = 'クリップボードにコピーしました'
    this.props.dispatch({ type: ACTION_TYPES.SET, message })
  }

  get apiSecrets(): ApiSecrets {
    return this.props.user.getApiSecrets()
  }

  render() {
    const { consumerId, token } = this.apiSecrets
    const url = `https://${consumerId}.i.orangesys.io`
    return (
      <div className={styles.whole}>
        <div className={styles['layout-offset-left']} />
        <div className={styles['layout-main']}>
          <Paper className={styles.paper}>
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn style={{ width: 70 }}>URL</TableRowColumn>
                  <TableRowColumn>
                    <a href={url}>{url}</a>
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>JWT Token</TableRowColumn>
                  <TableRowColumn>
                    <div className={styles.token}>
                      <div className={styles['token-text']}>
                        <TextField
                          value={token}
                          inputStyle={{ fontSize: '0.9rem' }}
                          fullWidth
                          name="token"
                          underlineShow={false}
                        />
                      </div>
                      <div className={styles['copy-token']}>
                        <CopyToClipboard
                          text={token}
                          onCopy={this.onCopy}
                        >
                          <IconButton
                            iconStyle={{ width: 12, height: 12 }}
                            style={{ width: 12, height: 12, padding: 3 }}
                          >
                            <FontIcon
                              className="fa fa-clipboard"
                              color={cssProps['--accent1Color']}
                            />
                          </IconButton>
                        </CopyToClipboard>
                      </div>
                    </div>

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
}
