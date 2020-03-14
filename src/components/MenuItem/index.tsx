/** @jsx jsx */
// @ts-nocheck
import { jsx } from '@emotion/core'
import { ReactNode } from 'react'
import * as styles from './style'

type Props = {
  Icon: ReactNode
  label: string
}

export const MenuItem = ({ Icon, label }: Props) => (
  <div css={styles.item}>
    <Icon />
    <div>{label}</div>
  </div>
)
