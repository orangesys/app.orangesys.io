import React from 'react'
import { Paper } from 'material-ui'
import styles from './styles.css'

import type { Plan } from '../../../../const'

type Props = {
  className?: string,
  plan: Plan,
  onClick: (e: SyntheticInputEvent) => void,
}

const Card = (props: Props) => {
  const { plan, className } = props
  const classNames = [styles.whole]
  if (className) { classNames.push(className) }
  return (
    <Paper className={classNames.join(' ')} onClick={props.onClick}>
      <div className={styles.content}>
        <div className={styles.title}>{plan.title}</div>
        <div className={styles.price}>¥{plan.price} / 月 (税抜)</div>
        <ul className={styles.attributes}>
          <li>データ保存期間: {plan.retentionText}</li>
          <li>ストレージ: {plan.storage}</li>
        </ul>
      </div>
    </Paper>
  )
}

Card.defaultProps = {
  className: '',
}

export default Card
