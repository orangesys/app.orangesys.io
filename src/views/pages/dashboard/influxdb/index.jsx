import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { getTelegraf } from 'src/core/auth';

import styles from './index.css';

const InfluxDB = ({ consumerId, token }) => {
  const influxDBUrl = `https://${consumerId}.i.orangesys.io`;
  return (
    <div className={styles.whole}>
      <Grid>
        <Row>
          <Col md={8} sm={10} xs={12}>
            <Paper className={styles.info} zDepth={1}>
              <div className={styles.header}>InfluxDB</div>
              <div>
                <Table selectable={false}>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn>URL</TableRowColumn>
                      <TableRowColumn style={{ width: '80%' }}>
                        <a href={influxDBUrl}>{influxDBUrl}</a>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>JWT Token</TableRowColumn>
                      <TableRowColumn>
                        <div className={styles.token}>{token}</div>
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Paper>
            <Paper className={styles.install} zDepth={1}>
              <div className={styles.header}>Telegrafインストール</div>
              <pre className={styles.command}>
                sudo bash -c "$(curl -sL https://raw.githubusercontent.com/orangesys/install/telegraf/install.sh)"
              </pre>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

InfluxDB.propTypes = {
  consumerId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = createSelector(
  getTelegraf,
  ({ consumerId, token }) => ({ consumerId, token }),
);

export default connect(mapStateToProps)(InfluxDB);
