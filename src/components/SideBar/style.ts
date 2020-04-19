import { css } from '@emotion/core'
import { colors } from 'styles/common'

export const whole = css`
  width: 100%;
  height: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  background-color: ${colors.darkBlack};
  color: ${colors.white};
`

export const logo = css`
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
