/** @jsx jsx */
import { useContext } from 'react'
import { jsx } from '@emotion/core'
import { RouteComponentProps } from '@reach/router'

import * as styles from './style'
import { layoutOffset, layoutMain, MainStyle } from 'styles/layout-center'
import { Paper, Button } from '@material-ui/core'

import { ViewerContext } from 'contexts/Viewer'
import { GlobalMessageContext } from 'contexts/GlobalMessage'

export default function VerificationGuide(props: RouteComponentProps) {
  const { viewer } = useContext(ViewerContext)
  const globalMessage = useContext(GlobalMessageContext)

  const onResendEmail = () => {
    try {
      viewer?.sendEmailVerification()
      globalMessage.setGlobalMessage({
        type: 'success',
        message: '確認メールを再送信しました',
        open: true,
      })
    } catch (error) {
      globalMessage.setGlobalMessage({
        type: 'error',
        message: error.code,
        open: true,
      })
    }
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
