import { css } from '@emotion/core'
import { mq } from './media-queries'

export const layoutOffset = mq({
  width: ['10%', '20%', '30%'],
})

export const layoutMain = mq({
  width: ['80%', '60%', '40%'],
})

export const MainStyle = css`
  margin-top: 24px;
  display: flex;
  align-items: center;
`
