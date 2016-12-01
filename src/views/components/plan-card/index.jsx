import React, { PropTypes } from 'react';
import { Card, CardText, CardActions } from 'material-ui/Card';
const cardStyle = { backgroundColor: 'none' };

import styles from './index.css';

const PlanCard = ({ plan, onClickPlan, hover, footer }) => (
  <div>
    <Card
      key={`setup-plan-${plan.id}`}
      className={styles[hover ? 'whole-with-hover' : 'whole']}
      style={cardStyle}
    >
      <CardText style={{ padding: 0 }} onClick={() => { onClickPlan(plan.id); }}>
        <div className={styles.title}>
          {plan.title}
        </div>
        <div className={styles.body}>
          <div>
            <span className={styles.price}>¥{plan.price}</span>
             / 月 (税抜)
          </div>
          <ul className={styles.attrs}>
            <li>{`データ保存期間: ${plan.retentionText}`}</li>
            <li>{`ストレージ: ${plan.storage}`}</li>
          </ul>
        </div>
        {footer ?
          <CardActions>
            {footer}
          </CardActions>
          : null
        }
      </CardText>
    </Card>
  </div>
);


PlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  onClickPlan: PropTypes.func.isRequired,
  hover: PropTypes.bool,
  footer: PropTypes.object,
};

PlanCard.defaultProps = {
  onClickPlan: () => {},
};

export default PlanCard;
