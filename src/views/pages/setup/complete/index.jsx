import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardHeader } from 'material-ui/Card';
import { browserHistory as history } from 'react-router';
import { getSetup, findPlan } from 'src/core/setup';
import Header from 'src/views/components/header-auth';
import styles from './index.css';

const Complete = ({ setup }) => {
  const { planId } = setup;
  const plan = findPlan(planId);
  return (
    <div>
      <Header />
      <Grid>
        <Row>
          <Col
            className={styles.navigation}
            xsOffset={1} xs={10}
            smOffset={2} sm={8}
            mdOffset={3} md={6}
          >
            <Paper className={styles.main}>
              <div className={styles.header}>
                初期設定完了
              </div>
              <div className={styles.body}>
                <div className={styles.message}>
                  登録が完了しました。
                </div>
                {plan &&
                <div className={styles.plan}>
                  <Card
                    key={`setup-plan-${plan.id}`}
                  >
                    <CardHeader
                      title={plan.title}
                      subtitle={plan.subtitle}
                    />
                  </Card>
                </div>
                }
                <div className={styles.bottom}>
                  <FlatButton
                    label="TOPへ" secondary
                    onClick={() => { history.replace('/'); }}
                  />
                </div>
              </div>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

Complete.propTypes = {
  setup: PropTypes.object.isRequired,
};

const mapStateToProps = createSelector(
  getSetup,
  (setup) => ({ setup }),
);

export default connect(mapStateToProps)(Complete);
