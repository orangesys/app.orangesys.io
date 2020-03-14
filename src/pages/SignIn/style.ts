import { css } from '@emotion/core'
import { colors, fontSize } from 'styles/common'

export const whole = css`
  margin-top: 40px;
  display: flex;
  align-items: center;
`

export const navigation = css`
  text-align: right;
`

export const paper = css`
  margin-top: 24px;
  margin-bottom: 24px;
`

export const main = css`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const title = css`
  border-bottom: 1px solid ${colors.border};
  background-color: ${colors.main};
  text-align: center;
  padding: 10px 0;
  color: ${colors.white};
  font-size: ${fontSize.M};
`

export const form = css`
  padding: 25px;
  display: flex;
  flex-direction: column;
`

export const field = css`
  margin-top: 10px;
`

export const submit = css`
  margin: 30px 0;
`

export const external = css`
  display: flex;
  flex-direction: column;
`

export const external_label = css`
  text-align: center;
  font-size: ${fontSize.XL};
`

export const external_actions = css`
  display: flex;
  flex-direction: row;
  flex: 1;
`

export const external_button = css`
  flex: 1;
  padding: 8px;
`
