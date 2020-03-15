// @ts-nocheck
/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps, navigate } from '@reach/router'

import * as styles from './style'
import { layoutOffset, layoutMain } from 'styles/layout-center'
import { Paper, CircularProgress } from '@material-ui/core'
import { useMachine } from '@xstate/react'
import { ServerSetupMachine } from './ServerSetupMachine'
import { routes } from 'routes'
import * as INFO from 'modules/support/info'
import { useContext, useEffect } from 'react'
import { ViewerContext } from 'contexts/Viewer'
import * as OrangesysApi from 'lib/orangesys-api'
import { UserService } from 'modules/user/user-service'
import { SERVER_SETUP_STATUS } from 'const/server-setup'
import { formatISO } from 'date-fns'

export const ServerSetup = (props: RouteComponentProps) => {
  const { viewer, setViewer } = useContext(ViewerContext)
  const userService = new UserService()
  const [state, send] = useMachine(ServerSetupMachine, {
    actions: {
      goNextPage: () => navigate(routes.DashBoard),
    },
    services: {
      requestCreatingServer: async () => {
        const uid = viewer?.getId()
        const retention = viewer?.getPlan().retention
        try {
          const apiClient = new OrangesysApi.Client()
          await apiClient.createServer(retention, uid)
          const user = await userService.updateServerSetupStatus(uid, {
            status: SERVER_SETUP_STATUS.BUILDING,
            startedAt: formatISO(new Date()),
          })
          setViewer(user)
        } catch (error) {
          const errorCode = 'creation_request_error'
          const errorMessage = err.toString()
          const user = await userService.updateServerSetupStatus(uid, {
            status: SERVER_SETUP_STATUS.ERRORED,
            errorCode,
            errorMessage,
          })
          setViewer(user)
        }
      },
    },
  })

  useEffect(() => {
    // @ts-ignore
    console.log(state.context.timer)
    if (viewer?.serverSetupNotStarted) {
      send('START_BUILD_SERVER')
    }
    if (viewer?.serverSetupBuilding) {
      send('WAIT')
    }
    if (viewer?.serverSetupErrored) {
      send('NOTIFY_ERROR', viewer.serverSetup?.errorCode)
    }
    if (viewer?.serverSetupCompleted) {
      send('NOTIFY_SUCCESS')
    }
  }, [send, state.context.timer, viewer])

  useEffect(() => {
    if (state.context.timer > 10000) {
      send('NOTIFY_ERROR')
    }
  }, [send, state.context.timer])

  return (
    <div css={styles.whole}>
      <div css={layoutOffset}></div>
      <div css={layoutMain}>
        <Paper>
          {state.value === 'building' && (
            <div css={styles.processing}>
              <p>現在サーバ構築中です。しばらくお待ちください</p>
              <div css={styles.progress}>
                <CircularProgress />
              </div>
            </div>
          )}

          {state.value === 'error' && (
            <div css={styles.error}>
              <div css={styles.errorText}>
                <p>サーバ構築時完了次第、管理者から連絡致します。</p>
                <p>ErrorCode: {viewer?.serverSetup?.errorCode}</p>
              </div>
              <p>
                <a href={`mailto:${INFO.SUPPORT_EMAIL}`}>{INFO.SUPPORT_EMAIL}</a> までお問い合わせください。
              </p>
            </div>
          )}
        </Paper>
      </div>
      <div css={layoutOffset}></div>
    </div>
  )
}
