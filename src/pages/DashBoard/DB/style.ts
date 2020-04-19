import { css } from '@emotion/core'
import { colors, fontSize } from 'styles/common'

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

export const table = css`
  display: flex;
  flex-direction: column;
`

export const row = css`
  display: flex;
  flex-direction: row;
`

export const name = css`
  width: 200px;
`

export const content = css`
  flex: 1;
`

export const action = css`
  margin-left: 8px;
`
