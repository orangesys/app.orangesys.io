import { css } from '@emotion/core'
import { colors, borderRadius, boxShadow, fontSize } from 'styles/common'

export const whole = css``

export const card = css`
  height: 200px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  ${boxShadow}
  ${borderRadius}
`

export const name = css`
  font-size: ${fontSize.L};
  text-decoration: underline;
`

export const price = css`
  font-size: ${fontSize.XL};
  font-weight: bold;
  color: ${colors.main};
`
export const description = css`
  font-size: ${fontSize.S};
`
