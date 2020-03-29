import { css } from '@emotion/core'
import { fontSize } from 'styles/common'

export const paper = css`
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 24px 24px;
  display: flex;
  flex-direction: column;
`

export const main = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const title = css`
  text-align: center;
  padding: 24px 0;
  font-size: ${fontSize.M};
`

export const list = css`
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const planCard = css`
  margin-top: 10px;
`

export const creditCardForm = css`
  margin-top: 50px;
  width: 100%;
`
