/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps, navigate } from '@reach/router'

import * as styles from './style'
import { layoutOffset, layoutMain } from 'styles/layout-center'
import { Paper, TextField, Button, LinearProgress } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { ViewerContext } from 'contexts/Viewer'
import { useContext } from 'react'
import { useMachine } from '@xstate/react'
import { BaseInfoMachine } from './BaseInfoMachine'
import { routes } from 'routes'
import { UserService } from 'modules/user/user-service'
import { Message } from 'components/Message'

const schema = yup.object().shape({
  companyName: yup.string().required(),
  fullName: yup.string().required(),
})

export function BaseInfo(props: RouteComponentProps) {
  const { viewer, setViewer } = useContext(ViewerContext)
  const [state, send] = useMachine(BaseInfoMachine, {
    actions: {
      goNextPage: context => {
        const { data: user } = context
        setViewer(user)
        navigate(routes.DashBoard)
      },
    },
    services: {
      createUserToDB: async (_, e) => {
        const userService = new UserService()
        const { companyName, fullName } = e.data
        return await userService.createUserWithOAuth({ companyName, fullName })
      },
    },
  })

  const { register, handleSubmit } = useForm({
    validationSchema: schema,
  })

  const onSubmit = (data: any) => {
    send('SUBMIT', { data })
  }

  return (
    <div css={styles.whole}>
      <div css={layoutOffset}></div>
      <div css={layoutMain}>
        <Paper>
          <div css={styles.main}>
            <div css={styles.title}>会社情報</div>
            <div>
              <form css={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div css={styles.field}>
                  <TextField
                    inputRef={register}
                    name="companyName"
                    label="会社名"
                    fullWidth
                    required
                    defaultValue={viewer?.getCompanyName()}
                  />
                </div>
                <div css={styles.field}>
                  <TextField
                    inputRef={register}
                    name="fullName"
                    label="名前（フルネーム）"
                    fullWidth
                    required
                    defaultValue={viewer?.getFullName()}
                  />
                </div>
                <div css={styles.field}>
                  <TextField name="email" label="メールアドレス" fullWidth value={viewer?.email} disabled />
                </div>
                {state.value === 'submitting' && <LinearProgress />}

                <div css={styles.submit}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={state.value === 'submitting'}
                  >
                    登録
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Paper>
      </div>
      <div css={layoutOffset}></div>
      {/* FIXME: add failure state */}
      <Message open={!!state?.context?.error} message={state?.context?.error?.code} type="error" />
    </div>
  )
}
