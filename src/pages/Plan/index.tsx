/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps } from '@reach/router'

import * as styles from './style'
import { layoutOffset, layoutMain } from 'styles/layout-center'
import { Paper, LinearProgress, Table, TableBody, TableRow, TableCell } from '@material-ui/core'

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
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>プラン</TableCell>
                <TableCell>{plan?.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>月額</TableCell>
                <TableCell>{plan?.price} / 月 (税抜)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>データ保存期間</TableCell>
                <TableCell>{plan?.retentionText}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Storage使用量</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
      <div css={layoutOffset}></div>
    </div>
  )
}
