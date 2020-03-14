/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FunctionComponent } from 'react'
import { TitleHeader } from 'components/TitleHeader'
import { SideBar } from '../SideBar'

import * as styles from './style'

type Props = {
  title: string
}

export const Layout: FunctionComponent<Props> = props => {
  return (
    <div css={styles.whole}>
      <SideBar />
      <div css={styles.main}>
        <TitleHeader title={props.title} />

        <div>{props.children}</div>
      </div>
    </div>
  )
}
