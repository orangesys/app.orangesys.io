/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps } from '@reach/router'

import * as styles from './style'
import { layoutOffset, layoutMain } from 'styles/layout-center'
import { Paper, LinearProgress } from '@material-ui/core'

import { ViewerContext } from 'contexts/Viewer'
import React, { useContext } from 'react'
import { useMachine } from '@xstate/react'
import { UsageMachine } from './UsageMachine'
import * as OrangesysApi from 'lib/orangesys-api'

export function Plan(props: RouteComponentProps) {
  const { viewer } = useContext(ViewerContext)
  const plan = viewer?.getPlan()

  const [state] = useMachine(UsageMachine, {
    services: {
      fetchStorageUsage: async () => {
        const apiClient = new OrangesysApi.Client({})
        const storageUsage = await apiClient.getStorageUsage(
          viewer?.getId() || '',
          viewer?.apiSecrets?.consumerId || '',
        )
        return storageUsage
      },
    },
  })

  if (!plan) {
    return <div>error</div>
  }

  const parseGB = (usage: number): string => (usage / 1024 / 1024 / 1024).toFixed(1)
  const parsePercent = (usage: number): number => parseInt(((usage / plan?.storageByte) * 100).toFixed(), 10)

  return (
    <div css={styles.whole}>
      <div css={layoutOffset}></div>
      <div css={layoutMain}>
        <Paper>
          <div css={styles.main}>
            <div css={styles.title}>プラン情報</div>
            <div css={styles.table}>
              <div css={styles.row}>
                <p css={styles.name}>プラン</p>
                <p css={styles.content}>{plan?.title}</p>
              </div>

              <div css={styles.row}>
                <p css={styles.name}>月額</p>
                <p css={styles.content}>{plan?.price} / 月 (税抜)</p>
              </div>

              <div css={styles.row}>
                <p css={styles.name}>データ保存期間 </p>
                <p css={styles.content}>{plan?.retentionText}</p>
              </div>

              <div css={styles.row}>
                <p css={styles.name}>Storage使用量</p>
                <div css={styles.content}>
                  {state.value === 'loading' && <div>...</div>}
                  {state.value === 'success' && (
                    <React.Fragment>
                      <p>
                        {parseGB(state.context.data)} GB/{plan?.storage} GB
                      </p>
                      <LinearProgress variant="determinate" value={parsePercent(state.context.data)} />
                    </React.Fragment>
                  )}
                  {state.value === 'failure' && <span>{state.context.error}</span>}
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>
      <div css={layoutOffset}></div>
    </div>
  )
}
