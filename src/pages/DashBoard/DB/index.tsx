/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as styles from './style'
import { layoutOffset, layoutMain, MainStyle } from 'styles/layout-center'
import { Paper, Table, TableBody, TableRow, TableCell, TextField, IconButton } from '@material-ui/core'
import CopyToClipboard from 'react-copy-to-clipboard'
import { ViewerContext } from 'contexts/Viewer'
import { useContext, useState } from 'react'
import { FileCopy as IconCopy } from '@material-ui/icons'
import { RouteComponentProps } from '@reach/router'
import { Message } from 'components/Message'

export const DB = (props: RouteComponentProps) => {
  const [copied, setCopied] = useState(false)
  const { viewer } = useContext(ViewerContext)
  const consumerId = viewer?.apiSecrets?.consumerId ?? ''
  const token = viewer?.apiSecrets?.token ?? ''

  const grafanaUrl = `https://${consumerId}.g.orangesys.io`

  return (
    <div css={MainStyle}>
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
                <TableCell>JWT Token</TableCell>
                <TableCell>
                  <div css={styles.row}>
                    <div css={styles.content}>
                      <TextField name="token" value={token} fullWidth disabled />
                    </div>
                    <div css={styles.action}>
                      <CopyToClipboard text={token} onCopy={() => setCopied(true)}>
                        <IconButton aria-label="copy" size="small">
                          <IconCopy />
                        </IconButton>
                      </CopyToClipboard>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
      <div css={layoutOffset}></div>
      <Message open={copied} onClose={() => setCopied(false)} type="info" message="クリップボードにコピーしました" />
    </div>
  )
}
