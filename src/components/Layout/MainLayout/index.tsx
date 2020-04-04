/** @jsx jsx */
import React, { Suspense } from 'react'
import { jsx } from '@emotion/core'
import { FunctionComponent } from 'react'
import { TitleHeader } from 'components/TitleHeader'

import * as styles from './style'
import { Loading } from 'components/Loading'

const SideBar = React.lazy(() => import('components/SideBar'))

type Props = {
  title: string
}

export const MainLayout: FunctionComponent<Props> = props => {
  return (
    <div css={styles.whole}>
      <div css={styles.sidebar}>
        <Suspense fallback={<Loading />}>
          <SideBar />
        </Suspense>
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
