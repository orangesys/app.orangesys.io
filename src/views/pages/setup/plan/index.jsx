import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory as history } from 'react-router';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import { Card, CardHeader } from 'material-ui/Card';

import Header from 'src/views/components/header-auth';
import { plans, setupActions } from 'src/core/setup';
import styles from './index.css';
const cardStyle = { backgroundColor: 'none' };

const Plan = ({ onClickPlan }) => (
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
              プラン選択
            </div>
            <div className={styles.body}>
              <div className={styles.message}>
                以下よりプランを選択してください。
              </div>
              <div>
                {plans.map(plan => (
                  <Card
                    key={`setup-plan-${plan.id}`} className={styles['plan-item']} style={cardStyle}
                  >
                    <CardHeader
                      title={plan.title}
                      subtitle={plan.subtitle}
                      onClick={() => { onClickPlan(plan.id); }}
                    />
                  </Card>
                ))}
              </div>
            </div>
          </Paper>
        </Col>
      </Row>
    </Grid>
  </div>
);

Plan.propTypes = {
  onClickPlan: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onClickPlan: (planId) => {
    dispatch(setupActions.selectPlan({ planId }));
    history.replace('/setup/payment');
  },
});

export default connect(() => ({}), mapDispatchToProps)(Plan);
