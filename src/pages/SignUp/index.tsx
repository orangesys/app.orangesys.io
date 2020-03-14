/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { TextField, Button, Paper, LinearProgress } from '@material-ui/core'
import { ExitToApp, GitHub as GitHubIcon } from '@material-ui/icons'
import { RouteComponentProps } from '../../lib/router'

import * as styles from './style'
import { layoutMain, layoutOffset } from 'styles/layout-center'
import { routes } from 'routes'
import { navigate } from '@reach/router'

import { useMachine } from '@xstate/react'
import { SignUpMachine, SignUpContext } from './SignUpMachie'
import { UserService } from 'modules/user/user-service'
import { LogoHeader } from 'components/LogoHeader'
import React, { useContext } from 'react'
import { ViewerContext } from 'contexts/Viewer'
import User from 'modules/user/user'

const schemaWithPassword = yup.object().shape({
  companyName: yup.string().required(),
  fullName: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
})

const schemaWithOAuth = yup.object().shape({
  companyName: yup.string().required(),
  fullName: yup.string().required(),
})

export function SignUp(props: RouteComponentProps) {
  const [state, send] = useMachine(SignUpMachine, {
    actions: {
      goNextPage: (context: SignUpContext) => {
        const { data: user } = context
        setViewer(user)
        navigate(routes.DashBoard)
      },
    },

    services: {
      signUpWithEmailAndPassword: async (_, e): Promise<User> => {
        const { email, password, ...rest } = e.data
        return await userService.createUserWithEmailAndPassword(email, password, rest)
      },
      connectAuth: async (context, _): Promise<User> => {
        const { providerId } = context
        // @ts-ignore
        const provider = userService.generateProvider(providerId)
        return await userService.signInWithOAuth(provider)
      },
    },
  })

  const { setViewer } = useContext(ViewerContext)

  const userService = new UserService()
  const { register, handleSubmit } = useForm({
    validationSchema: state.context.providerId ? schemaWithOAuth : schemaWithPassword,
  })
  const onSubmit = async (data: any) => {
    const { providerId } = state.context
    if (providerId) {
      send('CREATE_USER', { data })
    } else {
      send('SUBMIT', { data })
    }
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
            <Button color="secondary" endIcon={<ExitToApp />} onClick={() => navigate(routes.SignIn)}>
              既にアカウントをお持ちの方
            </Button>
          </div>
          <Paper>
            <div css={styles.main}>
              <div css={styles.title}>{state.context.providerId ? '外部アカウントで登録' : '新規ユーザ登録'}</div>
              <div>
                <form css={styles.form} onSubmit={handleSubmit(onSubmit)}>
                  <div css={styles.field}>
                    <TextField inputRef={register} name="companyName" label="会社名" fullWidth required />
                  </div>
                  <div css={styles.field}>
                    <TextField inputRef={register} name="fullName" label="名前 (フルネーム)" fullWidth required />
                  </div>

                  <React.Fragment>
                    <div css={styles.field}>
                      <TextField inputRef={register} name="email" label="メールアドレス" fullWidth />
                    </div>
                    <div css={styles.field}>
                      <TextField inputRef={register} name="password" type="password" label="パスワード" fullWidth />
                    </div>
                  </React.Fragment>

                  {state.value === 'loading' && <LinearProgress />}
                  {state?.context?.error?.message}

                  <div css={styles.submit}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                      disabled={state.value === 'loading'}
                    >
                      メールアドレスで登録
                    </Button>
                  </div>

                  <div css={styles.external}>
                    <p css={styles.external_label}>外部アカウントで登録</p>
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
        </div>
        <div css={layoutOffset}></div>
      </div>
    </div>
  )
}
