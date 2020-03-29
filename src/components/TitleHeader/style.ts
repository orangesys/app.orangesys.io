import { css } from '@emotion/core'
import { colors, fontSize } from '../../styles/common'

export const whole = css`
  display: flex;
  align-items: center;
  border-bottom: 3px solid ${colors.primary};
  height: 100px;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: ${fontSize.XL};
  background-color: ${colors.white};
  box-shadow: 0 3px 3px 0 rgb(230, 230, 230);
`

export const appName = css`
  color: ${colors.primary};
  margin-left: 24px;
`

export const separator = css`
  margin-left: 10px;
  margin-right: 10px;
  color: ${colors.darkGray};
  letter-spacing: 0;
  font-size: 8px;
`
