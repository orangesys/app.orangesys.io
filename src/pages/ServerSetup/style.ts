import { css } from '@emotion/core'
import { colors } from 'styles/common'

export const whole = css`
  margin-top: 50px;
  display: flex;
`

export const paper = css`
  padding: 20px;
`

export const processing = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const progress = css`
  padding-top: 20px;
`

export const error = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const errorText = css`
  color: ${colors.error}
  text-align: center;
`
