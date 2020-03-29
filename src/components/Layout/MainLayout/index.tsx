/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FunctionComponent } from 'react'
import { TitleHeader } from 'components/TitleHeader'
import { SideBar } from 'components/SideBar'

import * as styles from './style'

type Props = {
  title: string
}

export const MainLayout: FunctionComponent<Props> = props => {
  return (
    <div css={styles.whole}>
      <div css={styles.sidebar}>
        <SideBar />
      </div>

      <div css={styles.container}>
        <div css={styles.header}>
          <TitleHeader title={props.title} />
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  )
}
