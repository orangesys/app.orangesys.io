/** @jsx jsx */
import { jsx } from '@emotion/core'
import logoImage from '../../images/logo@3x.png'
import * as styles from './style'

export const LogoHeader = () => (
  <header>
    <div css={styles.topBar} />
    <div css={styles.main}>
      <div>
        <img src={logoImage} alt="OrangeSys Logo" width={36} height={36} />
      </div>
      <div css={styles.title}>Orangesys</div>
    </div>
  </header>
)
