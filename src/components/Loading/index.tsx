/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { CircularProgress } from '@material-ui/core'

const styles = {
  whole: css`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}

export function Loading() {
  return (
    <div css={styles.whole}>
      <CircularProgress />
    </div>
  )
}
