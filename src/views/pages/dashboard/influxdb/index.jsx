import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { getTelegraf } from 'src/core/auth';
import { dashboardActions } from 'src/core/dashboard';
import { getCSSPropertyOf } from 'src/views/utils';

import styles from './index.css';

const InfluxDB = ({ consumerId, token, onCopyToken }) => {
  const influxDBUrl = `https://${consumerId}.i.orangesys.io`;
  return (
    <div className={styles.whole}>
      <Grid>
        <Row>
          <Col md={8} sm={10} xs={12}>
            <Paper className={styles.info} zDepth={1}>
              <div>
                <Table selectable={false}>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn style={{ width: 70 }}>URL</TableRowColumn>
                      <TableRowColumn>
                        <a href={influxDBUrl}>{influxDBUrl}</a>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>JWT Token</TableRowColumn>
                      <TableRowColumn>
                        <div className={styles.token}>
                          <div className={styles['token-text']}>
                            <TextField
                              value={token}
                              inputStyle={{ fontSize: '0.8rem' }}
                              fullWidth
                              name="token"
                              underlineShow={false}
                            />
                          </div>
                          <div className={styles['copy-token']}>
                            <CopyToClipboard
                              text={token}
                              onCopy={onCopyToken}
                            >
                              <IconButton
                                iconStyle={{ width: 12, height: 12 }}
                                style={{ width: 12, height: 12, padding: 3 }}
                              >
                                <FontIcon
                                  className="fa fa-clipboard"
                                  color={getCSSPropertyOf('--accent1Color')}
                                />
                              </IconButton>
                            </CopyToClipboard>
                          </div>
                        </div>

                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

InfluxDB.propTypes = {
  consumerId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  onCopyToken: PropTypes.func.isRequired,
  planId: PropTypes.string,
};

const mapStateToProps = createSelector(
  getTelegraf,
  ({ consumerId, token }) =>
  ({ consumerId, token }),
);


const mapDispatchToProps = (dispatch) => ({
  onCopyToken: () => {
    dispatch(dashboardActions.setMessage('クリップボードにコピーしました'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfluxDB);
