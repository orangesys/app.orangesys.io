/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps } from '@reach/router'

import * as styles from './style'

import { TextField, Button, LinearProgress } from '@material-ui/core'
import { Email } from '@material-ui/icons'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { ViewerContext } from 'contexts/Viewer'
import { useContext, useState } from 'react'
import { useMachine } from '@xstate/react'
import { BaseInfoMachine } from './BaseInfoMachine'
import { UserService } from 'modules/user/user-service'
import { Message } from 'components/Message'

const schema = yup.object().shape({
  companyName: yup.string().required(),
  fullName: yup.string().required(),
})

export function AccountSetting(props: RouteComponentProps) {
  const { viewer, setViewer } = useContext(ViewerContext)
  const [state, send] = useMachine(BaseInfoMachine, {
    actions: {
      notify: context => {
        const { data: user } = context
        setViewer(user)
      },
    },
    services: {
      submit: async (_, e) => {
        const userService = new UserService()
        const { companyName, fullName } = e.data
        const user = await userService.updateProfile(viewer?.getId() ?? '', companyName, fullName)
        setViewer(user)
        return user
      },
    },
  })

  const { register, handleSubmit } = useForm({
    validationSchema: schema,
  })

  const onSubmit = (data: any) => {
    send('SUBMIT', { data })
  }

  const [sentEmail, setSentEmail] = useState(false)

  const sendMailForResetPassword = () => {
    const userService = new UserService()
    userService.sendPasswordResetEmail(viewer?.email ?? '')
    setSentEmail(true)
  }

  return (
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
      <div css={styles.field}>
        <Button color="secondary" startIcon={<Email />} onClick={sendMailForResetPassword}>
          パスワード再設定
        </Button>
      </div>

      {state.value === 'submitting' && <LinearProgress />}

      <div css={styles.submit}>
        <Button variant="contained" color="primary" fullWidth type="submit" disabled={state.value === 'submitting'}>
          登録
        </Button>
      </div>
      {/* FIXME: add failure state */}
      <Message
        open={sentEmail}
        onClose={() => setSentEmail(false)}
        message="パスワード再設定用のメールを送信しました。"
        type="info"
      />
      <Message open={!!state?.context?.error} message={state?.context?.error?.code} type="error" />
    </form>
  )
}
