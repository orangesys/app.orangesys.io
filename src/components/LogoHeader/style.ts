import { css } from '@emotion/core'
import { colors } from '../../styles/common'

export const topBar = css`
  display: flex;
  height: 4px;
  background: linear-gradient(
    90deg,
    ${colors.primary} 0%,
    ${colors.main} 10%,
    ${colors.second} 20%,
    ${colors.third} 30%,
    ${colors.primary} 40%,
    ${colors.main} 50%,
    ${colors.second} 60%,
    ${colors.third} 70%,
    ${colors.primary} 80%,
    ${colors.main} 90%,
    ${colors.second} 100%
  );
`

export const main = css`
  padding: 5px 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

export const title = css`
  font-size: 1.6rem;
  color: ${colors.primary};
  margin-left: 12px;
  padding-bottom: 4px;
  font-family: 'Hind', sans-serif;
`
