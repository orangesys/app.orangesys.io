/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps } from '@reach/router'

import * as styles from './style'
import { layoutOffset, layoutMain, MainStyle } from 'styles/layout-center'
import { Paper, Button } from '@material-ui/core'
import { useContext } from 'react'
import { ViewerContext } from 'contexts/Viewer'

export function VerificationGuide(props: RouteComponentProps) {
  const { viewer } = useContext(ViewerContext)

  const onResendEmail = () => {
    viewer?.sendEmailVerification()
  }

  return (
    <div css={MainStyle}>
      <div css={layoutOffset}></div>
      <div css={layoutMain}>
        <Paper>
          <div css={styles.main}>
            <p css={styles.message}>送信されたメールを確認しメールアドレスの認証を行ってください。</p>
            <div css={styles.resend}>
              <Button color="primary" onClick={onResendEmail}>
                確認メールを再送信
              </Button>
            </div>
          </div>
        </Paper>
      </div>
      <div css={layoutOffset}></div>
    </div>
  )
}
