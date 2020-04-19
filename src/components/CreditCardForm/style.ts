import { css } from '@emotion/core'
import { fontSize, colors } from 'styles/common'

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
  display: flex;
  flex-direction: column;
`

export const field = css`
  margin-top: 16px;
`

export const submit = css`
  margin: 24px 0;
`
