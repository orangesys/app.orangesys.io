/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as styles from './style'
import { PlanType } from 'modules/plan/plans'

export const PlanCard = ({ plan }: { plan: PlanType }) => {
  return (
    <div css={styles.card}>
      <div css={styles.name}>{plan.title}</div>
      <div css={styles.price}>¥ {plan.price} / 月 (税抜)</div>
      <div>
        <div>データ保存期間: {plan.retentionText}</div>
        <div>ストレージ: {plan.storage}</div>
      </div>
    </div>
  )
}
