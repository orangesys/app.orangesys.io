/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as styles from './style'
import { layoutOffset, layoutMain } from 'styles/layout-center'
import { Paper, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { ViewerContext } from 'contexts/Viewer'
import { useContext } from 'react'
import { RouteComponentProps } from 'lib/router'

export const Graph = (props: RouteComponentProps) => {
  const { viewer } = useContext(ViewerContext)
  const consumerId = viewer?.apiSecrets?.consumerId ?? ''

  const grafanaUrl = `https://${consumerId}.g.orangesys.io`

  return (
    <div css={styles.whole}>
      <div css={layoutOffset}></div>
      <div css={layoutMain}>
        <Paper>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>URL</TableCell>
                <TableCell>
                  <a href={grafanaUrl}>{grafanaUrl}</a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>
                  <strong>admin</strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Password</TableCell>
                <TableCell>
                  <strong>{consumerId && btoa(consumerId)}</strong>
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
