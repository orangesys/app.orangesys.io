/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps, useNavigate } from '@reach/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import * as styles from './style'
import { layoutOffset, layoutMain } from 'styles/layout-center'
import { Paper, Button, TextField, LinearProgress } from '@material-ui/core'
import { PersonAdd, Email, GitHub as GitHubIcon } from '@material-ui/icons'
import { routes } from 'routes'
import { useMachine } from '@xstate/react'
import { SignInMachine } from './SignInMachine'
import { UserService } from 'modules/user/user-service'
import { LogoHeader } from 'components/LogoHeader'
import { useContext, useState } from 'react'
import { ViewerContext } from 'contexts/Viewer'
import { PasswordReset } from './PasswordReset'
import { Message } from 'components/Message'

const schema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
})

export function SignIn(props: RouteComponentProps) {
  const { setViewer } = useContext(ViewerContext)

  const navigate = useNavigate()
  const userService = new UserService()
  const [openPasswordReset, setOpenPasswordReset] = useState(false)
  const onCancelPasswordReset = () => {
    setOpenPasswordReset(false)
  }

  const onSubmitPasswordRest = (email: string) => {
    userService.sendPasswordResetEmail(email)
    setOpenPasswordReset(false)
  }

  const [state, send] = useMachine(SignInMachine, {
    actions: {
      goNextPage: context => {
        const { data: user } = context
        setViewer(user)
        console.log(user)

        navigate(routes.DashBoard)
      },
    },
    services: {
      signInWithEmailAndPassword: async (_, e) => {
        const { email, password } = e.data
        return await userService.signInWithEmailAndPassword(email, password)
      },
      signInWithOAuth: async (context, _) => {
        const { providerId } = context
        // @ts-ignore
        const provider = userService.generateProvider(providerId)
        return await userService.signInWithOAuth(provider)
      },
    },
  })

  const { register, handleSubmit } = useForm({
    validationSchema: schema,
  })

  const onSubmit = async (data: any) => {
    send('SUBMIT', { data })
  }

  const connectGoogle = async () => {
    send('CONNECT_AUTH', { providerId: 'google.com' })
  }
  const connectGitHub = async () => {
    send('CONNECT_AUTH', { providerId: 'github.com' })
  }

  return (
    <div>
      <LogoHeader />

      <div css={styles.whole}>
        <div css={layoutOffset}></div>
        <div css={layoutMain}>
          <div css={styles.navigation}>
            <Button color="secondary" startIcon={<PersonAdd />} onClick={() => navigate(routes.SignUp)}>
              新規アカウント登録へ
            </Button>
          </div>
          <Paper css={styles.paper}>
            <div css={styles.main}>
              <div css={styles.title}>ログイン</div>
              <div>
                <form css={styles.form} onSubmit={handleSubmit(onSubmit)}>
                  <div css={styles.field}>
                    <TextField inputRef={register} name="email" label="メールアドレス" fullWidth />
                  </div>
                  <div css={styles.field}>
                    <TextField inputRef={register} name="password" type="password" label="パスワード" fullWidth />
                  </div>
                  {state.value === 'loading' && <LinearProgress />}
                  <div css={styles.submit}>
                    <Button variant="contained" color="primary" fullWidth type="submit">
                      メールアドレスでログイン
                    </Button>
                  </div>

                  <div css={styles.external}>
                    <p css={styles.external_label}>外部アカウントでログイン</p>
                    <div css={styles.external_actions}>
                      <div css={styles.external_button}>
                        <Button variant="contained" fullWidth startIcon={<GitHubIcon />} onClick={connectGoogle}>
                          Google
                        </Button>
                      </div>
                      <div css={styles.external_button}>
                        <Button variant="contained" fullWidth startIcon={<GitHubIcon />} onClick={connectGitHub}>
                          GitHub
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Paper>
          <div>
            <Button color="secondary" startIcon={<Email />} onClick={() => setOpenPasswordReset(true)}>
              パスワード再設定
            </Button>
            {openPasswordReset && <PasswordReset onCancel={onCancelPasswordReset} onSubmit={onSubmitPasswordRest} />}
          </div>
        </div>
        <div css={layoutOffset}></div>
      </div>
      {/* FIXME: add failure state */}
      <Message open={!!state?.context?.error} message={state?.context?.error?.code} type="error" />
    </div>
  )
}
