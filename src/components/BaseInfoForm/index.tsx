/** @jsx jsx */
import { jsx } from '@emotion/core'
import { TextField, Button, LinearProgress } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { ViewerContext } from 'contexts/Viewer'
import { useContext } from 'react'
import * as styles from './style'

const schema = yup.object().shape({
  companyName: yup.string().required(),
  fullName: yup.string().required(),
})

type Props = {
  onSubmit: (data: any) => void
  loading: boolean
  error: string
}

export function BaseInfo({ onSubmit, loading, error }: Props) {
  const { viewer } = useContext(ViewerContext)

  const { register, handleSubmit } = useForm({
    validationSchema: schema,
  })

  return (
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
              defaultValue={viewer?.displayName}
            />
          </div>
          <div css={styles.field}>
            <TextField name="email" label="メールアドレス" fullWidth value={viewer?.email} disabled />
          </div>
          {loading && <LinearProgress />}
          {error && <p>{error}</p>}

          <div css={styles.submit}>
            <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading}>
              登録
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
