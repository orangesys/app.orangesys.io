import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { getTelegraf } from 'src/core/auth';

import styles from './index.css';

const Grafana = ({ consumerId }) => {
  const grafanaUrl = `https://${consumerId}.g.orangesys.io`;
  return (
    <div className={styles.whole}>
      <Grid>
        <Row>
          <Col md={8} sm={10} xs={12}>
            <Paper className={styles.main} zDepth={1}>
              <div>
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
                        <strong>********</strong>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>password</TableRowColumn>
                      <TableRowColumn>
                        <strong>********</strong>
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
}

Grafana.propTypes = {
  consumerId: PropTypes.string.isRequired,
  token: PropTypes.string,
};

const mapStateToProps = createSelector(
  getTelegraf,
  ({ consumerId }) => ({ consumerId }),
);

export default connect(mapStateToProps)(Grafana);
