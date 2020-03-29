/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import * as styles from './style'

type Props = {
  title: string
}

export const TitleHeader: FunctionComponent<Props> = ({ title }) => (
  <header css={styles.whole}>
    <div css={styles.appName}>Orangesys.io</div>
    <div css={styles.separator}>&gt;&gt;</div>
    <div>{title}</div>
  </header>
)
