import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory as history } from 'react-router';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
// import { Card, CardText } from 'material-ui/Card';

import Header from 'src/views/components/header-auth';
import PlanCard from 'src/views/components/plan-card';
import { plans, setupActions } from 'src/core/setup';

import styles from './index.css';
// const cardStyle = { backgroundColor: 'none' };

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
                  <PlanCard
                    plan={plan}
                    hover
                    onClickPlan={() => { onClickPlan(plan.id); }}
                    key={`select-plan-${plan.id}`}
                  />
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
